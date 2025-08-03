import { type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Button } from '../base/button';
import { Minus, Plus } from 'lucide-react';

interface PanelSectionProps {
  label: string;
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  isSubsection?: boolean;
}

function PanelSection({
  label,
  show,
  setShow,
  children,
  isSubsection,
}: PanelSectionProps) {
  return (
    <div>
      <div
        className={`flex justify-between items-center mb-2 ${
          !isSubsection ? 'mt-8' : ''
        }`}
      >
        <h3 className={`font-semibold mb-4 ${!isSubsection ? 'text-xl' : ''}`}>
          {label}
        </h3>
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
      {show && <div className="flex flex-col gap-4 ml-4">{children}</div>}
    </div>
  );
}
export default PanelSection;
