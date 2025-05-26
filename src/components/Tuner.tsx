import { useEffect, useRef, useState } from "react";
import { YIN } from "pitchfinder";
import Midi from "@tonaljs/midi";

export default function Tuner() {
  const [note, setNote] = useState<string>("–");
  const [cents, setCents] = useState<number>(0);
  const [active, setActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Float32Array | null>(null);
  const detector = useRef(YIN({ sampleRate: 44100 }));

  // Start/stop mic
  const toggleTuner = async () => {
    if (active) {
      audioCtxRef.current?.close();
      setActive(false);
    } else {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataRef.current = new Float32Array(analyser.fftSize);
      detector.current = YIN({ sampleRate: ctx.sampleRate });
      setActive(true);
    }
  };

  // Poll for pitch
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const analyser = analyserRef.current;
      const data = dataRef.current;
      if (active && analyser && data) {
        analyser.getFloatTimeDomainData(data);
        const frequency = detector.current(data) || 0;
        if (frequency > 0) {
          // freq → midi (decimal)
          const midi = Midi.freqToMidi(frequency);
          const rounded = Math.round(midi);
          // midi → pitch-class note
          const name = Midi.midiToNoteName(rounded, {
            pitchClass: true,
            sharps: true,
          });
          // cents difference
          const diff = Math.round((midi - rounded) * 100);
          setNote(name);
          setCents(diff);
        } else {
          setNote("–");
          setCents(0);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div className="h-[90vh] max-h-[800px] w-full max-w-xs flex flex-col justify-center items-center p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <button
        onClick={toggleTuner}
        className={`px-4 py-2 rounded ${
          active ? "bg-red-600" : "bg-green-600"
        }`}
        style={{ fontSize: "clamp(1rem, 2vw, 1.5rem)" }}
      >
        {active ? "Stop Tuner" : "Start Tuner"}
      </button>

      <div className="flex-1 flex flex-col justify-center items-center w-full gap-y-4">
        <div
          className="font-bold"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 6rem)",
            lineHeight: 1,
          }}
        >
          {note}
        </div>
        <div
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
          }}
        >
          {cents > 0 ? `+${cents}` : cents < 0 ? `${cents}` : "–"}¢
        </div>

        {/* Tuner needle */}
        <div className="relative h-3 bg-gray-700 rounded mt-6 overflow-hidden w-full max-w-full">
          <div
            className="absolute top-0 h-full bg-white"
            style={{ left: `${50 + cents / 2}%`, width: "2px" }}
          />
          <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-500" />
        </div>

        <div
          className="flex justify-between text-sm mt-2 w-full max-w-full"
          style={{ fontSize: "clamp(0.7rem, 1.2vw, 1rem)" }}
        >
          <span>-50¢</span>
          <span>0¢</span>
          <span>+50¢</span>
        </div>
      </div>
    </div>
  );
}
