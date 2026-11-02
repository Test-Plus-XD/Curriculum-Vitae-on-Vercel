import { bi, pick } from '@/lib/i18n-text';
import { HalftoneField, PosterSheet, PRESS } from './press';

/// The real map of the Zuul game, taken from `createRooms()` in `Zuul.java`: every room below sits on the grid its
/// `setExit` calls imply, measured from the Whispering Grove (east, north). The plan is then tilted into a
/// Constructivist axonometric. Exits carry a direction but no distance, so the last leg may run long without
/// breaking the map, and that leg is what turns into the wedge.

// Screen position of grid cell (0, 0) and the length and slant of one step east or north.
const ORIGIN = { x: 152, y: 262 };
const EAST = { x: 92, y: -23 };
const NORTH = { x: -14, y: -46 };
// Half the side of a room, as a fraction of one grid step on each axis.
const ROOM_EAST = 0.165;
const ROOM_NORTH = 0.31;
// How far either side of the Echoing Vault's column the outward and homeward lanes of the route run.
const LANE = 0.115;
// The Triumph Sanctum's east coordinate. The source puts it one step east of the vault; only the direction is kept.
const SANCTUM_EAST = 4.3;
const SANCTUM_RADIUS = 56;
const WEDGE_HALF = 0.66;

type Cell = readonly [east: number, north: number];

// The ten `new Room(...)` calls at their grid cells. `route` marks the rooms the winning walk passes through.
const ROOMS: ReadonlyArray<{ cell: Cell; route: boolean }> = [
  { cell: [0, 0], route: true }, // Whispering Grove, the start
  { cell: [0, 1], route: true }, // Chamber of the Eternal Pillars
  { cell: [1, 1], route: true }, // Echoing Vault
  { cell: [1, 0], route: true }, // Sentinel's Keep
  { cell: [1, -1], route: true }, // Alchemist's Hearth, where the Elderfruit lies
  { cell: [1, 2], route: true }, // Vault of Forgotten Riches, the Starving Warden's room
  { cell: [0, 2], route: false }, // Tomekeeper's Lair
  { cell: [-1, 1], route: false }, // The Mossbound Garden
  { cell: [1, -2], route: false }, // The Forsaken Labyrinth
];

// The 18 `setExit` calls pair up into nine two-way corridors. Five are listed here, three more make up the spine
// below, and the ninth, into the Sanctum, is the wedge.
const CORRIDORS: ReadonlyArray<readonly [Cell, Cell]> = [
  [[0, 0], [0, 1]],
  [[0, 1], [0, 2]],
  [[0, 1], [-1, 1]],
  [[0, 1], [1, 1]],
  [[1, 1], [1, 2]],
];
// Echoing Vault down to the Labyrinth is drawn as one wide spine, as the route uses it twice.
const SPINE: readonly [Cell, Cell] = [[1, 1], [1, -2]];

// The shortest win, as traced from the source: go north, east, south, south, take the Elderfruit, go north, north,
// north, give the fruit to the Warden, take the Aegis. The lanes split so the there-and-back shows as a hairpin.
const ROUTE: ReadonlyArray<Cell> = [
  [0, 0],
  [0, 1],
  [1 - LANE, 1],
  [1 - LANE, -1.12],
  [1 + LANE, -1.12],
  [1 + LANE, 2],
];

// Maps a grid position to rounded viewBox coordinates along the tilted axes.
function project(east: number, north: number) {
  return {
    x: Math.round((ORIGIN.x + east * EAST.x + north * NORTH.x) * 10) / 10,
    y: Math.round((ORIGIN.y + east * EAST.y + north * NORTH.y) * 10) / 10,
  };
}

// Joins grid positions into an SVG points string.
function pointsOf(cells: ReadonlyArray<Cell>) {
  return cells
    .map(([east, north]) => {
      const point = project(east, north);
      return `${point.x},${point.y}`;
    })
    .join(' ');
}

// One room drawn as a parallelogram square to the tilted grid: solid ink if the winning walk enters it, a hollow
// outline if it is a dead end the walk never needs.
function RoomBlock({ cell, route }: { cell: Cell; route: boolean }) {
  const [east, north] = cell;
  const corners: Cell[] = [
    [east - ROOM_EAST, north - ROOM_NORTH],
    [east + ROOM_EAST, north - ROOM_NORTH],
    [east + ROOM_EAST, north + ROOM_NORTH],
    [east - ROOM_EAST, north + ROOM_NORTH],
  ];
  return <polygon points={pointsOf(corners)} fill={route ? PRESS.ink : PRESS.paper} stroke={PRESS.ink} strokeWidth="5" />;
}

const LABEL = bi(
  "Constructivist floor plan of the Zuul text adventure: its ten rooms as tilted ink blocks joined by their real exits, with a red route that doubles back from the Alchemist's Hearth and ends as a wedge driven east into the Triumph Sanctum.",
  '以構成主義平面圖描繪 Zuul 文字冒險遊戲：十個房間化為傾斜的墨色方塊，由遊戲中真實的出口相連；紅色路線先到煉金術士之爐折返，最後化成楔形向東刺入勝利聖所。',
);

// Poster for the Zuul text adventure: a transit map of its real rooms that turns into Lissitzky's "Beat the Whites".
// The whole plan is drawn from `createRooms()`: nine ink or hollow rooms and their exits on the grid those exits
// imply (north is marked, as the plan is tilted), and the shortest winning walk in red. That walk is the idea of the
// game: the Sanctum needs the Aegis, the Starving Warden gives it up only for the Elderfruit, and the fruit lies south,
// so the route must hairpin round the Alchemist's Hearth (the kraft disc) before it can head for the goal. Its last
// move, `go east`, becomes the wedge that crosses into the black field and pierces the white disc of the Sanctum.
// `setExit × 18` is the literal count of exit calls. The theme word "Arcane" is absent because the source never uses it.
export default function ZuulGamePoster({ locale }: { locale: string }) {
  const sanctum = project(SANCTUM_EAST, 2);
  const hearth = project(1, -1);
  const grove = project(0, 0);
  const spineStart = project(...SPINE[0]);
  const spineEnd = project(...SPINE[1]);
  const angle = (Math.atan2(EAST.y, EAST.x) * 180) / Math.PI;
  return (
    <PosterSheet label={pick(LABEL, locale)}>
      <polygon points="404,0 640,0 640,360 318,360" fill={PRESS.ink} />
      <g transform="translate(30 322) rotate(-14)">
        <HalftoneField x={0} y={0} columns={12} rows={3} step={13} fill={PRESS.red} />
      </g>
      <circle cx={hearth.x} cy={hearth.y} r="35" fill={PRESS.kraft} />
      <circle cx={sanctum.x} cy={sanctum.y} r={SANCTUM_RADIUS} fill={PRESS.paper} />
      <polygon
        points={pointsOf([
          [1, 2 + WEDGE_HALF],
          [1, 2 - WEDGE_HALF],
          [SANCTUM_EAST + 0.34, 2],
        ])}
        fill={PRESS.red}
      />
      <line x1={spineStart.x} y1={spineStart.y} x2={spineEnd.x} y2={spineEnd.y} stroke={PRESS.ink} strokeWidth="30" />
      {CORRIDORS.map(([from, to]) => (
        <line
          key={`${from}-${to}`}
          x1={project(...from).x}
          y1={project(...from).y}
          x2={project(...to).x}
          y2={project(...to).y}
          stroke={PRESS.ink}
          strokeWidth="12"
        />
      ))}
      {ROOMS.map((room) => (
        <RoomBlock key={room.cell.join()} cell={room.cell} route={room.route} />
      ))}
      <polyline points={pointsOf(ROUTE)} fill="none" stroke={PRESS.red} strokeWidth="8" strokeLinejoin="miter" />
      <circle cx={grove.x} cy={grove.y} r="9" fill={PRESS.paper} stroke={PRESS.red} strokeWidth="5" />
      <text transform={`translate(404 192) rotate(${angle})`} className="poster-type" fontSize="24" fill={PRESS.paper}>
        &gt; go east
      </text>
      <text x="622" y="340" className="poster-display" fontSize="54" textAnchor="end" fill={PRESS.paper}>
        ZUUL
      </text>
      <text x="26" y="40" className="poster-type" fontSize="20" fill={PRESS.ink}>
        setExit × 18
      </text>
      <polygon points="52,110 72.2,135.2 65.5,137.3 70.8,154.6 61.2,157.5 55.9,140.2 49.2,142.2" fill={PRESS.ink} />
      <text x="26" y="118" className="poster-display" fontSize="18" fill={PRESS.ink}>
        N
      </text>
    </PosterSheet>
  );
}
