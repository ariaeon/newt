import { ConfigOptions } from '@/consts/config.consts';
import { Card, CardContent, CardTitle } from '@/components/base/card';
import { Label } from '@/components/base/label';
import { Slider } from '@/components/base/slider';
import { Input } from '@/components/base/input';
import { Button } from '@/components/base/button';
import { SlidersHorizontal, X } from 'lucide-react';
import { Checkbox } from '@/components/base/checkbox';
import { useConfigStore } from '@/store';

import { useState } from 'react';
import CurveEditor from '../CurveEditor/CurveEditor';
import PanelSection from './PanelSection';
import { presets } from '@/consts/config.consts';

const initialPanelState = {
  body: true,
  parts: true,
  eyes: false,
  tongue: false,
  fins: false,
  debug: false,
};

function ControlPanel() {
  const config = useConfigStore((state) => state.config);
  const setBody = useConfigStore((state) => state.setBody);
  const setParts = useConfigStore((state) => state.setParts);
  const setDebug = useConfigStore((state) => state.setDebug);
  const [configOpen, setConfigOpen] = useState(true);
  const [showPanels, setShowPanels] = useState(initialPanelState);
  const {
    SEGMENT_AMOUNT_MIN,
    SEGMENT_AMOUNT_MAX,
    SEGMENT_DISTANCE_MIN,
    SEGMENT_DISTANCE_MAX,
    MAX_BEND_MIN,
    MAX_BEND_MAX,
  } = ConfigOptions;
  const { body, parts } = config;

  const togglePane = (panel: string) => {
    setShowPanels((prev) => ({
      ...prev,
      [panel]: !prev[panel as keyof typeof initialPanelState],
    }));
  };

  return (
    <Card
      className={`absolute top-4 left-4 w-full transition-all duration-300 ease-in-out max-h-[calc(100vh-2rem)] overflow-hidden gap-0 ${
        configOpen ? 'max-w-sm' : 'max-w-10 p-0'
      }`}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <CardTitle className={configOpen ? 'px-6' : 'p-0'}>
        <div className="flex">
          <div
            className={`transition-opacity duration-300 ${
              configOpen ? 'opacity-0 max-w-0 max-h-0' : 'opacity-100 max-w-10'
            }`}
          >
            <Button
              variant="ghost"
              size={'icon'}
              onClick={() => setConfigOpen(!configOpen)}
              type="button"
              aria-label={configOpen ? 'Close config' : 'Open config'}
            >
              <SlidersHorizontal />
            </Button>
          </div>
          <div
            className={`flex grow justify-between ${
              configOpen ? 'opacity-100 max-w-sm' : 'opacity-0 max-w-0 max-h-0'
            } `}
          >
            <h2 className="text-2xl whitespace-nowrap">Control panel</h2>
            <Button
              variant="ghost"
              size={'icon'}
              onClick={() => setConfigOpen(!configOpen)}
              type="button"
              aria-label={configOpen ? 'Close config' : 'Open config'}
            >
              <X />
            </Button>
          </div>
        </div>
      </CardTitle>
      <CardContent
        className="overflow-scroll transition-all duration-300 ease-in-out"
        style={{
          maxHeight: configOpen ? '800px' : '0px',
          opacity: configOpen ? 1 : 0,
        }}
      >
        <div className="mb-4 flex gap-2 items-center">
          <label htmlFor="preset-select" className="text-sm font-medium">
            Preset:
          </label>
          <select
            id="preset-select"
            className="border rounded px-2 py-1 text-sm"
            onChange={(e) => {
              const presetName = e.target.value as keyof typeof presets;
              if (presets[presetName]) {
                useConfigStore.getState().setConfig(presets[presetName]);
              }
            }}
            defaultValue={Object.keys(presets)[0]}
          >
            {Object.keys(presets).map((preset) => (
              <option key={preset} value={preset}>
                {preset}
              </option>
            ))}
          </select>
        </div>
        <form>
          <PanelSection
            label="Body"
            show={showPanels.body}
            setShow={() => togglePane('body')}
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-4 col-span-2">
                <Label htmlFor="segmentLength">Amount of segments</Label>
                <Slider
                  id="segmentLength"
                  min={SEGMENT_AMOUNT_MIN}
                  max={SEGMENT_AMOUNT_MAX}
                  step={1}
                  className="w-full"
                  onValueChange={(value: number[]) =>
                    setBody({ segmentAmount: value[0] })
                  }
                  value={[body.segmentAmount]}
                />
              </div>
              <div className="grid gap-4 col-span-2">
                <Label htmlFor="segmentDistance">Segment distance</Label>
                <Slider
                  id="segmentDistance"
                  min={SEGMENT_DISTANCE_MIN}
                  max={SEGMENT_DISTANCE_MAX}
                  step={1}
                  className="w-full"
                  onValueChange={(value: number[]) =>
                    setBody({ segmentDistance: value[0] })
                  }
                  value={[body.segmentDistance]}
                />
              </div>
              <div className="grid gap-4 col-span-2">
                <Label htmlFor="maxBend">Flexibility</Label>
                <Slider
                  id="maxBend"
                  min={MAX_BEND_MIN}
                  max={MAX_BEND_MAX}
                  step={0.01}
                  className="w-full"
                  onValueChange={(value: number[]) =>
                    setBody({ maxBend: value[0] })
                  }
                  value={[body.maxBend]}
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="fillColor">Color</Label>
                <Input
                  id="fillColor"
                  type="color"
                  className="w-full h-8 p-0 border-none bg-transparent"
                  value={body.fillColor}
                  onChange={(e) => setBody({ fillColor: e.target.value })}
                />
              </div>

              <div className="col-span-2 grid gap-4">
                <Label>Body thickness curve</Label>
                <CurveEditor />
              </div>
            </div>
          </PanelSection>
          <PanelSection
            label="Parts"
            show={showPanels.parts}
            setShow={() => togglePane('parts')}
          >
            <div className="grid gap-8">
              <PanelSection
                label="Eyes"
                show={showPanels.eyes}
                setShow={() => togglePane('eyes')}
                isSubsection
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-4">
                    <Label htmlFor="parts-eyes-enabled">Enabled</Label>
                    <Checkbox
                      id="parts-eyes-enabled"
                      checked={parts.eyes.enabled}
                      onCheckedChange={(checked) =>
                        setParts({
                          eyes: { ...parts.eyes, enabled: !!checked },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-eyes-hasPupils">Pupils</Label>
                    <Checkbox
                      id="parts-eyes-hasPupils"
                      checked={parts.eyes.hasPupils}
                      onCheckedChange={(checked) =>
                        setParts({
                          eyes: { ...parts.eyes, hasPupils: !!checked },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-eyes-size">Size</Label>
                    <Input
                      id="parts-eyes-size"
                      type="number"
                      min={1}
                      max={50}
                      step={1}
                      className="w-full"
                      value={parts.eyes.size}
                      onChange={(e) =>
                        setParts({
                          eyes: { ...parts.eyes, size: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-eyes-color">Color</Label>
                    <Input
                      id="parts-eyes-color"
                      type="color"
                      className="w-full h-8 p-0 border-none bg-transparent"
                      value={parts.eyes.color}
                      onChange={(e) =>
                        setParts({
                          eyes: { ...parts.eyes, color: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-eyes-segmentIndex">
                      Segment index
                    </Label>
                    <Input
                      id="parts-eyes-segmentIndex"
                      type="number"
                      min={0}
                      max={body.segmentAmount - 1}
                      step={1}
                      className="w-full"
                      value={parts.eyes.segmentIndex}
                      onChange={(e) =>
                        setParts({
                          eyes: {
                            ...parts.eyes,
                            segmentIndex: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-eyes-segmentOffset">
                      Segment offset
                    </Label>
                    <Input
                      id="parts-eyes-segmentOffset"
                      type="number"
                      min={0}
                      max={2}
                      step={0.1}
                      className="w-full"
                      value={parts.eyes.segmentOffset}
                      onChange={(e) =>
                        setParts({
                          eyes: {
                            ...parts.eyes,
                            segmentOffset: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4 col-span-2">
                    <Label htmlFor="parts-eyes-angle">Angle</Label>
                    <Slider
                      id="parts-eyes-angle"
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                      value={[parts.eyes.angle]}
                      onValueChange={(value: number[]) =>
                        setParts({ eyes: { ...parts.eyes, angle: value[0] } })
                      }
                    />
                  </div>
                </div>
              </PanelSection>
              <PanelSection
                label="Tongue"
                show={showPanels.tongue}
                setShow={() => togglePane('tongue')}
                isSubsection
              >
                <div className="grid gap-4">
                  <Label htmlFor="parts-tongue">Tongue</Label>
                  <Checkbox
                    id="parts-tongue"
                    checked={parts.tongue}
                    onCheckedChange={(checked) =>
                      setParts({ tongue: !!checked })
                    }
                  />
                </div>
              </PanelSection>
              <PanelSection
                label="Fins"
                show={showPanels.fins}
                setShow={() => togglePane('fins')}
                isSubsection
              >
                <div className="grid grid-cols-2 gap-6">
                  <div className="grid gap-4">
                    <Label htmlFor="parts-fins-enabled">Fins enabled</Label>
                    <Checkbox
                      id="parts-fins-enabled"
                      checked={parts.fins.enabled}
                      onCheckedChange={(checked) =>
                        setParts({
                          fins: { ...parts.fins, enabled: !!checked },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-fins-segmentIndex">
                      Segment index
                    </Label>
                    <Input
                      id="parts-fins-segmentIndex"
                      type="number"
                      min={0}
                      max={body.segmentAmount - 1}
                      step={1}
                      className="w-full"
                      value={parts.fins.segmentIndex}
                      onChange={(e) =>
                        setParts({
                          fins: {
                            ...parts.fins,
                            segmentIndex: Number(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-fins-fillColor">Fill color</Label>
                    <Input
                      id="parts-fins-fillColor"
                      type="color"
                      className="w-full h-8 p-0 border-none bg-transparent"
                      value={parts.fins.fillColor}
                      onChange={(e) =>
                        setParts({
                          fins: { ...parts.fins, fillColor: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-fins-radiusX">Length</Label>
                    <Slider
                      id="parts-fins-radiusX"
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                      value={[parts.fins.radiusX]}
                      onValueChange={(value: number[]) =>
                        setParts({
                          fins: {
                            ...parts.fins,
                            radiusX: value[0],
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4">
                    <Label htmlFor="parts-fins-radiusY">Width</Label>
                    <Slider
                      id="parts-fins-radiusY"
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                      value={[parts.fins.radiusY]}
                      onValueChange={(value: number[]) =>
                        setParts({
                          fins: {
                            ...parts.fins,
                            radiusY: value[0],
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4 col-span-2">
                    <Label htmlFor="parts-fins-angle">Angle</Label>
                    <Slider
                      id="parts-fins-angle"
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                      value={[parts.fins.angle]}
                      onValueChange={(value: number[]) =>
                        setParts({ fins: { ...parts.fins, angle: value[0] } })
                      }
                    />
                  </div>
                </div>
              </PanelSection>
            </div>
          </PanelSection>
          <PanelSection
            label="Debug"
            show={showPanels.debug}
            setShow={() => togglePane('debug')}
          >
            {config.debug && (
              <div className="flex flex-col gap-4">
                {Object.entries(config.debug).map(([key, value]) => (
                  <div className="flex items-center gap-2" key={key}>
                    <Checkbox
                      id={`debug-${key}`}
                      checked={!!value}
                      onCheckedChange={(checked) =>
                        setDebug({ [key]: !!checked })
                      }
                    />
                    <Label htmlFor={`debug-${key}`}>{key}</Label>
                  </div>
                ))}
              </div>
            )}
          </PanelSection>
        </form>
      </CardContent>
    </Card>
  );
}

export default ControlPanel;
