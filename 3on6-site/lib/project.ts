import { geoAlbersUsa } from 'd3-geo'

/** Same projection the bundled US map (content/us-map.json, from us-atlas states-albers-10m) was drawn with. */
const proj = geoAlbersUsa().scale(1300).translate([487.5, 305])
/** [x, y] on the 975×610 map, or null outside the lower 48 / Alaska / Hawaii (e.g. Canada, Guam). */
export const toMap = (lat?: number, lng?: number): [number, number] | null => {
  if (lat == null || lng == null) return null
  const p = proj([lng, lat])
  return p ? [Math.round(p[0] * 10) / 10, Math.round(p[1] * 10) / 10] : null
}
