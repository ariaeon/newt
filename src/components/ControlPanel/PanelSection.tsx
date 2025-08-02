import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Button } from '../base/button';
import { Minus, Plus } from 'lucide-react';

interface PanelSectionProps {
  label: string;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}

function PanelSection({ label, show, setShow, children }: PanelSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mt-8 mb-2">
        <h3 className="font-semibold text-xl">{label}</h3>
        <Button
          variant="ghost"
          size={'icon'}
          onClick={() => setShow(!show)}
          type="button"
          aria-label={show ? `Collapse ${label}` : `Expand ${label}`}
        >
          {show ? <Minus /> : <Plus />}
        </Button>
      </div>
      {show && <div className="flex flex-col gap-6">{children}</div>}
    </div>
  );
}
export default PanelSection;
