<template>
  <div>
    <div class="w-full bg-slate-200 p-2">
      <div class="flex flex-row gap-2 max-w-screen-lg m-auto">
        <select class="xs" name="" id="" v-model="root">
          <option v-for="note in Object.keys(noteValues)" :value="note">{{ note }}</option>
        </select>
        <select name="" id="" v-model="instrument">
          <option v-for="instrument in instruments" :value="instrument">
            {{ instrument.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="w-full p-2 m-auto max-w-screen-lg">
      <div class="flex flex-row gap-2">
        <button class="chord-button" :class="{ active: c === chord }" v-for="c in chords" :key="c" @click="toggleChord(c)">{{ c }}</button>
      </div>
    </div>

    <div class="container">
      <div class="fretboard">
        <div class="fret-numbers my-1">
          <div class="w-full"></div>
          <div class="fret-number" v-for="fret in 13" :key="fret">
            <span>{{ fret - 1 }}</span>
          </div>
        </div>
        <div class="string" v-for="(string, index) in strings" :key="index">
          <div class="string-label">{{ string.string }}</div>
          <div class="fret" v-for="fret in string.frets" :key="fret.fret">
            <div class="fret-label" :class="{ highlight: fret.highlight }">{{ fret.interval }}</div>
          </div>
        </div>
        <div class="fret-numbers my-1">
          <div class="w-full"></div>
          <div class="fret-number" v-for="fret in 13" :key="fret">
            <span>{{ fret + 11 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { instruments, noteValues, type Instrument, type Note } from "~/assets/instruments";

const route = useRoute();
definePageMeta({
  name: "Chord Visualizer",
});

useHead({
  title: "Chord Visualizer",
});

type Chord = 'I' | 'ii' | 'iii' | 'IV' | 'V' | 'vi' | 'vii';

const chords: Chord[] = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'];

const chordDictionary: Record<Chord, number[]> = {
  I: [1, 3, 5],
  ii: [2, 4, 6],
  iii: [3, 5, 7],
  IV: [4, 6, 1],
  V: [5, 7, 2],
  vi: [6, 1, 3],
  vii: [7, 2, 4],
};

const chord = ref<Chord | null>();

const toggleChord = (c: Chord) => {
  if (chord.value === c) {
    chord.value = null;
  } else {
    chord.value = c;
  }
};

// const stringNotes: Note[] = ["E", "A", "D", "G", "B", "E"];
const instrument = ref<Instrument>(instruments[0]);

const root = ref<Note>("D");

const value = (valueIn: number) => {
  return (valueIn % 12) + 1;
};

const filterChart = (root: Note) => {
  const intervals = [1, 3, 5, 6, 8, 10, 12];
  const notes: Record<number, number> = {};
  intervals.forEach((interval, index) => {
    const note = value(noteValues[root] + interval - 1);
    notes[note] = index + 1;
  });
  return notes;
};

const chart = computed(() => {
  return filterChart(root.value);
});

const strings = computed(() => {
  return instrument.value.stringNotes.map((string) => {
    return {
      string,
      frets: Array.from({ length: 13 }, (_, index) => index + 1).map((fret) => {
        const note = value(noteValues[string as Note] + fret - 1);
        const interval = chart.value[note] || "";
        const highlight = chord.value ? chordDictionary[chord.value].includes(chart.value[note]) : false;

        return {
          fret,
          note,
          interval,
          highlight,
        };
      }),
    };
  });
});

watch(instrument, () => {
  const query = {
    instrument: instrument.value.name,
    root: root.value
  };
  
  navigateTo({ query }, { replace: true });
});

watch(root, () => {
  const query = {
    instrument: instrument.value.name,
    root: root.value
  };
  
  navigateTo({ query }, { replace: true });
});

onMounted(() => {
  const instrumentParam = route.query.instrument as string;
  const rootParam = route.query.root as Note;

  if (instrumentParam) {
    const selectedInstrument = instruments.find(
      (i) => i.name.toLowerCase() === instrumentParam.toLowerCase()
    );
    if (selectedInstrument) {
      instrument.value = selectedInstrument;
    }
  }

  if (rootParam && Object.keys(noteValues).includes(rootParam)) {
    root.value = rootParam;
  }
});
</script>

<style lang="scss" scoped>
.container {
  @apply flex flex-col items-center justify-center my-10 m-auto max-w-screen-lg;

  .fretboard {
    @apply w-full flex flex-col;

    .string,
    .fret-numbers {
      @apply h-10 flex flex-row;

      .fret-number {
        @apply w-full bg-slate-300;
        @apply flex items-center justify-center text-white font-bold;
        @apply border-r-4 border-slate-200;

        &:nth-child(1) {
          @apply bg-slate-300;
        }
      }

      .string-label {
        @apply w-full h-10 bg-slate-800;
        @apply flex items-center justify-center text-white font-bold;
      }

      .fret {
        @apply w-full h-10 bg-slate-100 border-r-4 border-x-slate-800;

        .fret-label {
          @apply w-full h-10 border-y-2 border-y-slate-300;
          @apply flex items-center justify-center text-slate-800 font-bold;

          &.highlight {
            @apply bg-slate-500 text-white;
          }
        }

        &:nth-child(14) {
          @apply bg-slate-300 border-r-4 border-r-slate-200;

          .fret-label {
            @apply text-slate-700 border-y-slate-50;
          }
        }
      }
    }
  }
}

select {
  @apply w-full max-w-xs px-4 py-2 my-4;
  @apply bg-white border border-gray-300 rounded-md shadow-sm;
  @apply text-base text-gray-700;
  @apply appearance-none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;

  &:focus {
    @apply outline-none ring-2 ring-slate-500 border-slate-500;
  }

  &:hover {
    @apply border-gray-400;
  }

  &:disabled {
    @apply bg-gray-100 text-gray-500 cursor-not-allowed;
  }

  &.xs {
    @apply max-w-20;
  }

  &.sm {
    @apply max-w-60;
  }
}

.chord-button {
  @apply px-4 py-2 my-4;
  @apply bg-white border border-gray-300 rounded-md shadow-sm;
  @apply text-base text-gray-700 font-bold;
  @apply appearance-none;

  &.active {
    @apply bg-slate-500 text-white;
  }
}
</style>
