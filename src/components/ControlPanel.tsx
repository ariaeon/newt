import { Card, CardContent } from '@/components/base/card';
import { Label } from '@/components/base/label';
import { Slider } from './base/slider';
import { Input } from './base/input';
import { Button } from './base/button';
import { Minus, Plus, X } from 'lucide-react';
import { Checkbox } from './base/checkbox';
import { useConfigStore } from '@/store';

import { useState } from 'react';

function updateConfig(data: Record<string, unknown>) {
  useConfigStore.getState().setConfig(data);
}

//TODO cool animation

function ControlPanel() {
  const config = useConfigStore((state) => state.config);
  const [showConfig, setShowConfig] = useState(true);
  const [showSegments, setShowSegments] = useState(true);
  const [showStyle, setShowStyle] = useState(true);
  const [showDebug, setShowDebug] = useState(true);
  return (
    <Card
      className="absolute top-4 left-4 w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-scroll"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <CardContent>
        <div className="flex justify-between">
          <h2 className="text-2xl mb-2">Control panel</h2>
          <Button
            variant="ghost"
            size={'icon'}
            onClick={() => setShowConfig(!showConfig)}
            type="button"
            aria-label={showConfig ? 'Close config' : 'Open config'}
          >
            <X />
          </Button>
        </div>
        {showConfig && (
          <form>
            <div className="flex justify-between mt-8 mb-6">
              <h3 className="font-semibold ">Segments</h3>
              <Button
                variant="ghost"
                size={'icon'}
                onClick={() => setShowSegments(!showSegments)}
                type="button"
                aria-label={
                  showSegments ? 'Collapse Segments' : 'Expand Segments'
                }
              >
                {showSegments ? <Minus /> : <Plus />}
              </Button>
            </div>
            {showSegments && (
              <div className="flex flex-col gap-6">
                <div className="grid gap-4">
                  <Label htmlFor="segmentLength">Amount of segments</Label>
                  <Slider
                    id="segmentLength"
                    min={5}
                    max={25}
                    step={1}
                    className="w-full"
                    onValueChange={(value: number[]) =>
                      updateConfig({ segmentLength: value[0] })
                    }
                    value={[config.segmentLength]}
                  />
                </div>
                <div className="grid gap-4">
                  <Label htmlFor="segmentDistance">Segment distance</Label>
                  <Slider
                    id="segmentDistance"
                    min={10}
                    max={50}
                    step={1}
                    className="w-full"
                    onValueChange={(value: number[]) =>
                      updateConfig({ segmentDistance: value[0] })
                    }
                    value={[config.segmentDistance]}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-between mt-8 mb-6">
              <h3 className="font-semibold ">Style</h3>
              <Button
                variant="ghost"
                size={'icon'}
                onClick={() => setShowStyle(!showStyle)}
                type="button"
                aria-label={showStyle ? 'Collapse Style' : 'Expand Style'}
              >
                {showStyle ? <Minus /> : <Plus />}
              </Button>
            </div>
            {showStyle && (
              <div className="flex flex-col gap-6">
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
                      value={config.strokeWidth}
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
                      value={config.strokeColor}
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
                      checked={config.fillBool}
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
                      value={config.fillColor}
                      onChange={(e) =>
                        updateConfig({ fillColor: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 mb-6">
              <h3 className="font-semibold ">Debug</h3>
              <Button
                variant="ghost"
                size={'icon'}
                onClick={() => setShowDebug(!showDebug)}
                type="button"
                aria-label={showDebug ? 'Collapse Debug' : 'Expand Debug'}
              >
                {showDebug ? <Minus /> : <Plus />}
              </Button>
            </div>
            {showDebug && config.debug && (
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
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default ControlPanel;
