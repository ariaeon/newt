import { Card, CardContent } from '@/components/base/card';
import { Label } from '@/components/base/label';
import { Slider } from './base/slider';
import { Input } from './base/input';
import { Button } from './base/button';
import { Minus } from 'lucide-react';
import { Checkbox } from './base/checkbox';
import { useConfigStore } from '@/store';

function ControlPanel() {
  const config = useConfigStore((state) => state.config);
  return (
    <Card className="absolute top-4 left-4 w-full max-w-sm">
      <CardContent>
        <h2 className="text-2xl mb-2">Control panel</h2>
        <form>
          <div className="flex justify-between mt-8 mb-6">
            <h3 className="font-semibold ">Segments</h3>
            <Button variant="ghost" size={'icon'}>
              <Minus />
            </Button>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-4">
              <Label htmlFor="segmentLength">Amount of segments</Label>
              <Slider
                id="segmentLength"
                min={1}
                max={50}
                step={1}
                className="w-full"
                onValueChange={(value: number[]) => {
                  useConfigStore.getState().setConfig({
                    segmentLength: value[0],
                  });
                }}
                value={[config.segmentLength]}
              />
            </div>
            <div className="grid gap-4">
              <Label htmlFor="segmentDistance">Segment distance</Label>
              <Slider
                id="segmentDistance"
                min={20}
                max={100}
                step={1}
                className="w-full"
                onValueChange={(value: number[]) => {
                  useConfigStore.getState().setConfig({
                    segmentDistance: value[0],
                  });
                }}
                value={[config.segmentDistance]}
              />
            </div>
          </div>
          <div className="flex justify-between mt-8 mb-6">
            <h3 className="font-semibold ">Style</h3>
            <Button variant="ghost" size={'icon'}>
              <Minus />
            </Button>
          </div>
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
                  onChange={(e) => {
                    useConfigStore.getState().setConfig({
                      strokeWidth: Number(e.target.value),
                    });
                  }}
                />
              </div>
              <div className="grid gap-4 w-1/2">
                <Label htmlFor="strokeColor">Stroke color</Label>
                <Input
                  id="strokeColor"
                  type="color"
                  className="w-full"
                  value={config.strokeColor}
                  onChange={(e) => {
                    useConfigStore.getState().setConfig({
                      strokeColor: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="grid gap-4 w-1/2">
                <Label htmlFor="fillBool">Fill </Label>
                <Checkbox
                  id="fillBool"
                  checked={config.fillBool}
                  onCheckedChange={(checked) => {
                    useConfigStore.getState().setConfig({
                      fillBool: !!checked,
                    });
                  }}
                />
              </div>
              <div className="grid gap-4 w-1/2">
                <Label htmlFor="fillColor">Fill color</Label>
                <Input
                  id="fillColor"
                  type="color"
                  className="w-full"
                  value={config.fillColor}
                  onChange={(e) => {
                    useConfigStore.getState().setConfig({
                      fillColor: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ControlPanel;
