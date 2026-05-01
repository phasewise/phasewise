/**
 * Invoice number formatting.
 *
 * Firms have very different conventions:
 *   - INV-001 (default — number-only)
 *   - INV-26-0001 (year + 4-digit number)
 *   - 2026-INV-0042 (year first)
 *   - INV2600001 (no separators, year + 5 digits)
 *
 * Rather than try to anticipate every layout, expose a token format:
 *   {prefix}  -> the org's invoiceNumberPrefix (e.g. "INV")
 *   {YY}      -> 2-digit year ("26")
 *   {YYYY}    -> 4-digit year ("2026")
 *   {N}       -> the counter, no padding
 *   {N3}/{N4}/{N5} -> the counter, zero-padded to N digits
 *
 * Default format is "{prefix}-{N3}" which matches the pre-format
 * behavior — existing organizations see no change.
 *
 * Note: the counter itself is monotonic (org.invoiceNumberNext). If a
 * firm wants year-based counter reset (e.g. 2026 starts at 0001 again),
 * that's a separate feature. For now the year token in the format just
 * decorates the number.
 */
export function renderInvoiceNumber(
  format: string,
  prefix: string,
  counter: number,
  now: Date = new Date()
): string {
  const year = now.getFullYear();
  return format
    .replace(/\{prefix\}/gi, prefix)
    .replace(/\{YYYY\}/g, String(year))
    .replace(/\{YY\}/g, String(year).slice(-2))
    .replace(/\{N(\d+)\}/gi, (_, digits) =>
      String(counter).padStart(parseInt(digits, 10), "0")
    )
    .replace(/\{N\}/gi, String(counter));
}
