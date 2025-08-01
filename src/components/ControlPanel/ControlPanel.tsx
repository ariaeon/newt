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

function updateConfig(data: Record<string, unknown>) {
  useConfigStore.getState().setConfig(data);
}

//TODO cool animation
function ControlPanel() {
  const config = useConfigStore((state) => state.config);
  const [configOpen, setConfigOpen] = useState(false);
  const [showStyle, setShowStyle] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  const [showShape, setShowShape] = useState(true);
  const [showParts, setShowParts] = useState(true);
  const {
    SEGMENT_AMOUNT_MIN,
    SEGMENT_AMOUNT_MAX,
    SEGMENT_DISTANCE_MIN,
    SEGMENT_DISTANCE_MAX,
  } = ConfigOptions;
  const { shape, style, parts } = config;

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
        <form>
          <PanelSection label="Shape" show={showShape} setShow={setShowShape}>
            <div className="grid gap-4">
              <Label htmlFor="segmentLength">Amount of segments</Label>
              <Slider
                id="segmentLength"
                min={SEGMENT_AMOUNT_MIN}
                max={SEGMENT_AMOUNT_MAX}
                step={1}
                className="w-full"
                onValueChange={(value: number[]) =>
                  updateConfig({ segmentAmount: value[0] })
                }
                value={[shape.segmentAmount]}
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="segmentDistance">Segment distance</Label>
              <Slider
                id="segmentDistance"
                min={SEGMENT_DISTANCE_MIN}
                max={SEGMENT_DISTANCE_MAX}
                step={1}
                className="w-full"
                onValueChange={(value: number[]) =>
                  updateConfig({ segmentDistance: value[0] })
                }
                value={[shape.segmentDistance]}
              />
            </div>
            <div className="grid gap-4">
              <Label>Width</Label>
              <CurveEditor />
            </div>
          </PanelSection>
          <PanelSection label="Style" show={showStyle} setShow={setShowStyle}>
            <div className="flex gap-6">
              <div className="grid gap-4 w-1/2">
                <Label htmlFor="strokeWidth">Stroke width</Label>
                <Input
                  id="strokeWidth"
                  type="number"
                  className="w-full"
                  min={1}
                  max={10}
                  step={1}
                  value={style.strokeWidth}
                  onChange={(e) =>
                    updateConfig({ strokeWidth: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-4 w-1/2">
                <Label htmlFor="strokeColor">Stroke color</Label>
                <Input
                  id="strokeColor"
                  type="color"
                  className="w-full"
                  value={style.strokeColor}
                  onChange={(e) =>
                    updateConfig({ strokeColor: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="grid gap-4 w-1/2">
                <Label htmlFor="fillBool">Fill </Label>
                <Checkbox
                  id="fillBool"
                  checked={style.fillBool}
                  onCheckedChange={(checked) =>
                    updateConfig({ fillBool: !!checked })
                  }
                />
              </div>
              <div className="grid gap-4 w-1/2">
                <Label htmlFor="fillColor">Fill color</Label>
                <Input
                  id="fillColor"
                  type="color"
                  className="w-full"
                  value={style.fillColor}
                  onChange={(e) => updateConfig({ fillColor: e.target.value })}
                />
              </div>
            </div>
          </PanelSection>
          <PanelSection label="Parts" show={showParts} setShow={setShowParts}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="parts-eyes"
                  checked={parts?.eyes}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      parts: { ...config.parts, eyes: !!checked },
                    })
                  }
                />
                <Label htmlFor="parts-eyes">Eyes</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="parts-tongue"
                  checked={parts?.tongue}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      parts: { ...config.parts, tongue: !!checked },
                    })
                  }
                />
                <Label htmlFor="parts-tongue">Tongue</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="parts-fins"
                  checked={parts?.fins}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      parts: { ...config.parts, fins: !!checked },
                    })
                  }
                />
                <Label htmlFor="parts-fins">Fins</Label>
              </div>
            </div>
          </PanelSection>
          <PanelSection label="Debug" show={showDebug} setShow={setShowDebug}>
            {config.debug && (
              <div className="flex flex-col gap-4">
                {Object.entries(config.debug).map(([key, value]) => (
                  <div className="flex items-center gap-2" key={key}>
                    <Checkbox
                      id={`debug-${key}`}
                      checked={!!value}
                      onCheckedChange={(checked) =>
                        updateConfig({
                          debug: { ...config.debug, [key]: !!checked },
                        })
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
