export type Note =
  | "C"
  | "C#"
  | "Db"
  | "D"
  | "D#"
  | "Eb"
  | "E"
  | "F"
  | "F#"
  | "Gb"
  | "G"
  | "G#"
  | "Ab"
  | "A"
  | "A#"
  | "Bb"
  | "B";

export const noteValues: Record<Note, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export interface Instrument {
  name: string;
  stringNotes: Note[];
}

const guitar: Instrument = {
  name: "Guitar (Standard)",
  stringNotes: ["E", "A", "D", "G", "B", "E"],
};

const bass: Instrument = {
  name: "Bass (Standard)",
  stringNotes: ["E", "A", "D", "G"],
};

const ukulele: Instrument = {
  name: "Ukulele (Standard)",
  stringNotes: ["G", "C", "E", "A"],
};

const guitarOpenD: Instrument = {
  name: "Guitar (Open D)",
  stringNotes: ["D", "A", "D", "F#", "A", "D"],
};

const pedalSteel: Instrument = {
  name: "Pedal Steel (10 String)",
  stringNotes: ["B", "D", "E", "F#", "G#", "B", "E", "G#", "D#", "F#"],
};

const pedalSteel8: Instrument = {
  name: "Pedal Steel (8 String)",
  stringNotes: ["F#", "G#", "B", "D#", "F#", "G#", "B", "D#"],
};

const banjo: Instrument = {
  name: "Banjo (Standard)",
  stringNotes: ["G", "D", "G", "B", "D"],
};


export const instruments: Instrument[] = [
  guitar,
  guitarOpenD,
  pedalSteel,
  pedalSteel8,
  bass,
  ukulele,
  banjo,
];