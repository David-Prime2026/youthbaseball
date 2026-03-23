import clsx from "clsx";
type PtBackgroundImageProps = {
  additionalClassNames?: string;
};

function PtBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<PtBackgroundImageProps>) {
  return (
    <div className={clsx("bg-[#1e293b] justify-self-stretch relative rounded-[8px] row-1 self-stretch shrink-0", additionalClassNames)}>
      <div className="content-stretch flex flex-col gap-[4px] items-start pt-[14px] px-[14px] relative size-full">{children}</div>
    </div>
  );
}
type ButtonBackgroundImageProps = {
  additionalClassNames?: string;
};

function ButtonBackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<ButtonBackgroundImageProps>) {
  return (
    <div className={clsx("bg-[#0c4a6e] h-[33.333px] relative rounded-[6px] shrink-0", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#1e293b] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}

function ContainerBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="bg-[#1e293b] flex-[1_0_0] min-h-px min-w-px relative rounded-[6px] w-[179.771px]">
      <div aria-hidden="true" className="absolute border-[#334155] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center pl-[10.667px] pr-[0.667px] py-[0.667px] relative size-full">{children}</div>
    </div>
  );
}

function HeadingBackgroundImage({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="absolute h-[24px] left-[20.67px] top-[20.67px] w-[680.667px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#f1f5f9] text-[16px] top-[-0.33px] whitespace-nowrap">{children}</p>
    </div>
  );
}

function BackgroundImage2({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[33.333px] relative rounded-[6px] shrink-0">
      <div aria-hidden="true" className="absolute border-[0.667px] border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">{children}</div>
    </div>
  );
}

function BackgroundImage1({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="h-[21px] relative shrink-0">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center overflow-clip relative rounded-[inherit] size-full">{children}</div>
    </div>
  );
}
type BackgroundImageProps = {
  additionalClassNames?: string;
};

function BackgroundImage({ children, additionalClassNames = "" }: React.PropsWithChildren<BackgroundImageProps>) {
  return (
    <div className={clsx("bg-[#1e293b] flex-[1_0_0] min-h-px min-w-px relative rounded-[6px]", additionalClassNames)}>
      <div aria-hidden="true" className="absolute border-[#334155] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[10.667px] pr-[0.667px] py-[0.667px] relative size-full">{children}</div>
    </div>
  );
}
type ContainerBackgroundImageAndTextProps = {
  text: string;
};

function ContainerBackgroundImageAndText({ text }: ContainerBackgroundImageAndTextProps) {
  return (
    <div className="h-[30px] relative shrink-0 w-full">
      <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[30px] left-[72.26px] not-italic text-[#38bdf8] text-[20px] text-center top-[-0.33px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TableCellBackgroundImageAndText6Props = {
  text: string;
};

function TableCellBackgroundImageAndText6({ text }: TableCellBackgroundImageAndText6Props) {
  return (
    <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[414.39px] top-0 w-[96.885px]">
      <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[85px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TableCellBackgroundImageAndText5Props = {
  text: string;
};

function TableCellBackgroundImageAndText5({ text }: TableCellBackgroundImageAndText5Props) {
  return (
    <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[317.5px] top-0 w-[96.885px]">
      <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[85.58px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TableCellBackgroundImageAndText4Props = {
  text: string;
};

function TableCellBackgroundImageAndText4({ text }: TableCellBackgroundImageAndText4Props) {
  return (
    <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-0 top-0 w-[179.198px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[12px] not-italic text-[#38bdf8] text-[13px] top-[9.33px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TableCellBackgroundImageAndText3Props = {
  text: string;
  additionalClassNames?: string;
};

function TableCellBackgroundImageAndText3({ text, additionalClassNames = "" }: TableCellBackgroundImageAndText3Props) {
  return (
    <div className={clsx("absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] top-0 w-[96.885px]", additionalClassNames)}>
      <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[85px] not-italic text-[#cbd5e1] text-[13px] text-right top-[8.33px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TableCellBackgroundImageAndText2Props = {
  text: string;
};

function TableCellBackgroundImageAndText2({ text }: TableCellBackgroundImageAndText2Props) {
  return (
    <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[179.2px] top-0 w-[138.302px]">
      <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[126.97px] not-italic text-[#cbd5e1] text-[13px] text-right top-[8.33px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TableCellBackgroundImageAndText1Props = {
  text: string;
};

function TableCellBackgroundImageAndText1({ text }: TableCellBackgroundImageAndText1Props) {
  return (
    <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-0 top-0 w-[179.198px]">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[12px] not-italic text-[#cbd5e1] text-[13px] top-[9.33px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TableCellBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TableCellBackgroundImageAndText({ text, additionalClassNames = "" }: TableCellBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.833px] top-0 w-[96.885px]", additionalClassNames)}>
      <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[85px] not-italic text-[#cbd5e1] text-[13px] text-right top-[9px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type ButtonBackgroundImageAndText3Props = {
  text: string;
};

function ButtonBackgroundImageAndText3({ text }: ButtonBackgroundImageAndText3Props) {
  return (
    <div className="absolute bg-[#7f1d1d] border-[#991b1b] border-[0.667px] border-solid h-[52.833px] left-[575.31px] rounded-[6px] top-0 w-[76.021px]">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[37.5px] not-italic text-[#fca5a5] text-[12px] text-center top-[17.75px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type TextBackgroundImageAndTextProps = {
  text: string;
};

function TextBackgroundImageAndText({ text }: TextBackgroundImageAndTextProps) {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[7.24px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-0 not-italic text-[#64748b] text-[13px] top-px whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
}
type HeadingBackgroundImageAndTextProps = {
  text: string;
};

function HeadingBackgroundImageAndText({ text }: HeadingBackgroundImageAndTextProps) {
  return (
    <div className="h-[21px] relative shrink-0 w-full">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[21px] left-0 not-italic text-[#38bdf8] text-[14px] top-[0.67px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type ButtonBackgroundImageAndText2Props = {
  text: string;
};

function ButtonBackgroundImageAndText2({ text }: ButtonBackgroundImageAndText2Props) {
  return (
    <div className="absolute bg-[#7f1d1d] border-[#991b1b] border-[0.667px] border-solid h-[52.833px] left-[643.33px] rounded-[6px] top-0 w-[37.344px]">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[18.5px] not-italic text-[#fca5a5] text-[12px] text-center top-[17.75px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type YABackgroundImageProps = {
  additionalClassNames?: string;
};

function YABackgroundImage({ additionalClassNames = "" }: YABackgroundImageProps) {
  return (
    <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-[521.33px] top-0 w-[110px]">
      <LabelBackgroundImageAndText text="Vesting" additionalClassNames="w-[110px]" />
      <BackgroundImage additionalClassNames="w-[110px]">
        <TextInputBackgroundImageAndText text="4yr/1yr cliff" additionalClassNames="w-[88.667px]" />
      </BackgroundImage>
    </div>
  );
}
type NumberInputBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function NumberInputBackgroundImageAndText({ text, additionalClassNames = "" }: NumberInputBackgroundImageAndTextProps) {
  return (
    <BackgroundImage1 additionalClassNames={additionalClassNames}>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-[rgba(226,232,240,0.5)] whitespace-nowrap">{text}</p>
    </BackgroundImage1>
  );
}
type TextInputBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function TextInputBackgroundImageAndText({ text, additionalClassNames = "" }: TextInputBackgroundImageAndTextProps) {
  return (
    <BackgroundImage1 additionalClassNames={additionalClassNames}>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#e2e8f0] text-[14px] whitespace-nowrap">{text}</p>
    </BackgroundImage1>
  );
}
type LabelBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function LabelBackgroundImageAndText({ text, additionalClassNames = "" }: LabelBackgroundImageAndTextProps) {
  return (
    <div className={clsx("h-[16.5px] relative shrink-0", additionalClassNames)}>
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[16.5px] left-0 not-italic text-[#94a3b8] text-[11px] top-px whitespace-nowrap">{text}</p>
      </div>
    </div>
  );
}
type ButtonBackgroundImageAndText1Props = {
  text: string;
  additionalClassNames?: string;
};

function ButtonBackgroundImageAndText1({ text, additionalClassNames = "" }: ButtonBackgroundImageAndText1Props) {
  return (
    <BackgroundImage2 additionalClassNames={additionalClassNames}>
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[58.17px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">{text}</p>
    </BackgroundImage2>
  );
}
type ButtonBackgroundImageAndTextProps = {
  text: string;
  additionalClassNames?: string;
};

function ButtonBackgroundImageAndText({ text, additionalClassNames = "" }: ButtonBackgroundImageAndTextProps) {
  return (
    <div className={clsx("absolute bg-[#0c4a6e] border-[#1e293b] border-[0.667px] border-solid h-[33.333px] rounded-[6px] top-[10px]", additionalClassNames)}>
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[47.5px] not-italic text-[#38bdf8] text-[12px] text-center top-[8px] whitespace-nowrap">{text}</p>
    </div>
  );
}
type ParagraphBackgroundImageAndTextProps = {
  text: string;
};

function ParagraphBackgroundImageAndText({ text }: ParagraphBackgroundImageAndTextProps) {
  return (
    <div className="absolute h-[18px] left-[20.67px] top-[48.67px] w-[680.667px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#64748b] text-[12px] top-px whitespace-nowrap">{text}</p>
    </div>
  );
}

export default function QuickHtmlReactSolution() {
  return (
    <div className="bg-[#0a0f1a] relative size-full" data-name="Quick HTML React Solution">
      <div className="absolute content-stretch flex h-[108.167px] items-center left-0 pb-[0.667px] px-[24px] top-0 w-[762px]" data-name="Container" style={{ backgroundImage: "linear-gradient(171.921deg, rgb(12, 25, 41) 0%, rgb(30, 41, 59) 100%)" }}>
        <div aria-hidden="true" className="absolute border-[#1e293b] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
        <div className="flex-[714_0_0] h-[67.5px] min-h-px min-w-px relative" data-name="Container">
          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
            <div className="h-[16.5px] relative shrink-0 w-full" data-name="Container">
              <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-0 not-italic text-[#38bdf8] text-[11px] top-px tracking-[1.5px] uppercase whitespace-nowrap">{`Founder's Binder for Investment`}</p>
            </div>
            <div className="h-[33px] relative shrink-0 w-full" data-name="Heading 1">
              <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[33px] left-0 not-italic text-[#f1f5f9] text-[22px] top-px whitespace-nowrap">PRIME_TIME Systems</p>
            </div>
            <div className="h-[18px] relative shrink-0 w-full" data-name="Paragraph">
              <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#64748b] text-[12px] top-px whitespace-nowrap">Current assumptions for investment, logic and investment memo data</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bg-[#0f172a] border-[#1e293b] border-b-[0.667px] border-solid h-[95.333px] left-0 top-[108.17px] w-[762px]" data-name="Container">
        <ButtonBackgroundImageAndText text="Export CSV" additionalClassNames="left-[16px] w-[95.354px]" />
        <ButtonBackgroundImageAndText text="Export PDF" additionalClassNames="left-[119.35px] w-[94.677px]" />
        <div className="absolute bg-[#064e3b] border-[#065f46] border-[0.667px] border-solid h-[33.333px] left-[222.03px] rounded-[6px] top-[10px] w-[113.188px]" data-name="Button">
          <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[56.5px] not-italic text-[#6ee7b7] text-[12px] text-center top-[8px] whitespace-nowrap">💾 Save JSON</p>
        </div>
        <div className="absolute bg-[#064e3b] border-[#065f46] border-[0.667px] border-solid h-[33.333px] left-[343.22px] rounded-[6px] top-[10px] w-[113.823px]" data-name="Label">
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[14px] not-italic text-[#6ee7b7] text-[12px] top-[8px] whitespace-nowrap">📂 Load JSON</p>
        </div>
        <div className="absolute bg-[#0c4a6e] border-[#1e293b] border-[0.667px] border-solid h-[33.333px] left-[465.04px] rounded-[6px] top-[10px] w-[102.656px]" data-name="Label">
          <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[14px] not-italic text-[#38bdf8] text-[12px] top-[8px] whitespace-nowrap">Upload Logo</p>
        </div>
        <div className="absolute bg-[#7c3aed] border-[#1e293b] border-[0.667px] border-solid h-[33.333px] left-[575.7px] rounded-[6px] top-[10px] w-[82.5px]" data-name="Button">
          <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[41.5px] not-italic text-[#38bdf8] text-[12px] text-center top-[8px] whitespace-nowrap">🔗 Share</p>
        </div>
        <div className="absolute bg-[#dc2626] border-[#1e293b] border-[0.667px] border-solid h-[33.333px] left-[16px] rounded-[6px] top-[51.33px] w-[127.844px]" data-name="Button">
          <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[63.5px] not-italic text-[#38bdf8] text-[12px] text-center top-[8px] whitespace-nowrap">🔓 Set Password</p>
        </div>
        <div className="absolute h-[16.5px] left-[602.39px] top-[59.75px] w-[143.615px]" data-name="Text">
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[8px] not-italic text-[#64748b] text-[11px] top-px whitespace-nowrap">💾 Auto-saved to browser</p>
        </div>
      </div>
      <div className="absolute bg-[#0f172a] h-[69.333px] left-0 top-[203.5px] w-[762px]" data-name="Container">
        <div className="content-stretch flex gap-[4px] items-start overflow-clip pb-[0.667px] pl-[16px] pt-[10px] relative rounded-[inherit] size-full">
          <div className="bg-[#0c4a6e] h-[33.333px] relative rounded-[6px] shrink-0 w-[81.792px]" data-name="Button">
            <div aria-hidden="true" className="absolute border-[#38bdf8] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[6px]" />
            <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
              <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[41.17px] not-italic text-[#38bdf8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Cap Table</p>
            </div>
          </div>
          <BackgroundImage2 additionalClassNames="w-[64.698px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[32.67px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Assets</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[119.156px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[59.67px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">{`5-Year P&L / IRR`}</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[102.688px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[51.67px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Market Sizing</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[101.344px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[50.67px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Use of Funds</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[70px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[34.67px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Rounds</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[111.354px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[55.67px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">KPI Dashboard</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[126.688px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[64.17px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Valuation Scoring</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[89.802px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[45.17px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Term Sheet</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[82.021px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[40.67px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">PDF Docs</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[96.021px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[48.17px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Architecture</p>
          </BackgroundImage2>
          <BackgroundImage2 additionalClassNames="w-[80.01px]">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[40.17px] not-italic text-[#94a3b8] text-[12px] text-center top-[8.67px] whitespace-nowrap">Roadmap</p>
          </BackgroundImage2>
          <ButtonBackgroundImageAndText1 text="Financial Model" additionalClassNames="w-[115.354px]" />
          <ButtonBackgroundImageAndText1 text="Magic Quadrant" additionalClassNames="w-[116.021px]" />
        </div>
        <div aria-hidden="true" className="absolute border-[#1e293b] border-b-[0.667px] border-solid inset-0 pointer-events-none" />
      </div>
      <div className="absolute content-stretch flex flex-col gap-[16px] h-[1245.667px] items-start left-[20px] top-[292.83px] w-[722px]" data-name="Container">
        <div className="bg-[#0f172a] h-[347.167px] relative rounded-[10px] shrink-0 w-full" data-name="Bt">
          <div aria-hidden="true" className="absolute border-[#1e293b] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[10px]" />
          <HeadingBackgroundImage>{`Founders & Equity`}</HeadingBackgroundImage>
          <ParagraphBackgroundImageAndText text="Add or remove founders" />
          <div className="absolute h-[52.833px] left-[20.67px] top-[80.67px] w-[680.667px]" data-name="wI">
            <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-0 top-0 w-[248.667px]" data-name="yA">
              <LabelBackgroundImageAndText text="Name" additionalClassNames="w-[248.667px]" />
              <BackgroundImage additionalClassNames="w-[248.667px]">
                <TextInputBackgroundImageAndText text="Founder 1 (CEO)" additionalClassNames="w-[227.333px]" />
              </BackgroundImage>
            </div>
            <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-[260.67px] top-0 w-[248.667px]" data-name="yA">
              <LabelBackgroundImageAndText text="Shares" additionalClassNames="w-[248.667px]" />
              <BackgroundImage additionalClassNames="w-[248.667px]">
                <NumberInputBackgroundImageAndText text="4500000" additionalClassNames="w-[227.333px]" />
              </BackgroundImage>
            </div>
            <YABackgroundImage />
            <ButtonBackgroundImageAndText2 text="X" />
          </div>
          <div className="absolute h-[52.833px] left-[20.67px] top-[147.5px] w-[680.667px]" data-name="wI">
            <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-0 top-0 w-[248.667px]" data-name="yA">
              <LabelBackgroundImageAndText text="Name" additionalClassNames="w-[248.667px]" />
              <BackgroundImage additionalClassNames="w-[248.667px]">
                <TextInputBackgroundImageAndText text="Founder 2 (CTO)" additionalClassNames="w-[227.333px]" />
              </BackgroundImage>
            </div>
            <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-[260.67px] top-0 w-[248.667px]" data-name="yA">
              <LabelBackgroundImageAndText text="Shares" additionalClassNames="w-[248.667px]" />
              <BackgroundImage additionalClassNames="w-[248.667px]">
                <NumberInputBackgroundImageAndText text="3500000" additionalClassNames="w-[227.333px]" />
              </BackgroundImage>
            </div>
            <YABackgroundImage />
            <ButtonBackgroundImageAndText2 text="X" />
          </div>
          <div className="absolute bg-[#064e3b] border-[#065f46] border-[0.667px] border-solid h-[33.333px] left-[20.67px] rounded-[6px] top-[214.33px] w-[113.885px]" data-name="wI">
            <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[56px] not-italic text-[#6ee7b7] text-[12px] text-center top-[8px] whitespace-nowrap">+ Add Founder</p>
          </div>
          <div className="absolute h-[52.833px] left-[20.67px] top-[259.67px] w-[680.667px]" data-name="wI">
            <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-0 top-0 w-[680.667px]" data-name="yA">
              <LabelBackgroundImageAndText text="ESOP Pool" additionalClassNames="w-[680.667px]" />
              <BackgroundImage additionalClassNames="w-[680.667px]">
                <NumberInputBackgroundImageAndText text="1500000" additionalClassNames="w-[659.333px]" />
              </BackgroundImage>
            </div>
          </div>
        </div>
        <div className="bg-[#0f172a] h-[413px] relative rounded-[10px] shrink-0 w-full" data-name="Bt">
          <div aria-hidden="true" className="absolute border-[#1e293b] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[10px]" />
          <HeadingBackgroundImage>Investment Rounds</HeadingBackgroundImage>
          <ParagraphBackgroundImageAndText text="SAFEs and priced rounds" />
          <div className="absolute bg-[rgba(30,41,59,0.4)] content-stretch flex flex-col gap-[10px] h-[127.167px] items-start left-[20.67px] pb-[0.667px] pt-[14.667px] px-[14.667px] rounded-[8px] top-[80.67px] w-[680.667px]" data-name="wI">
            <div aria-hidden="true" className="absolute border-[#1e293b] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <HeadingBackgroundImageAndText text="Pre-Seed SAFE" />
            <div className="h-[52.833px] relative shrink-0 w-full" data-name="Container">
              <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-0 top-0 w-[179.771px]" data-name="yA">
                <LabelBackgroundImageAndText text="Name" additionalClassNames="w-[179.771px]" />
                <BackgroundImage additionalClassNames="w-[179.771px]">
                  <TextInputBackgroundImageAndText text="Pre-Seed SAFE" additionalClassNames="w-[158.438px]" />
                </BackgroundImage>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-[191.77px] top-0 w-[179.771px]" data-name="yA">
                <LabelBackgroundImageAndText text="Amount" additionalClassNames="w-[179.771px]" />
                <ContainerBackgroundImage>
                  <TextBackgroundImageAndText text="$" />
                  <NumberInputBackgroundImageAndText text="500000" additionalClassNames="w-[147.198px]" />
                </ContainerBackgroundImage>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-[383.54px] top-0 w-[179.771px]" data-name="yA">
                <LabelBackgroundImageAndText text="Val Cap" additionalClassNames="w-[179.771px]" />
                <ContainerBackgroundImage>
                  <TextBackgroundImageAndText text="$" />
                  <NumberInputBackgroundImageAndText text="6000000" additionalClassNames="w-[147.198px]" />
                </ContainerBackgroundImage>
              </div>
              <ButtonBackgroundImageAndText3 text="Remove" />
            </div>
          </div>
          <div className="absolute bg-[rgba(30,41,59,0.4)] content-stretch flex flex-col gap-[10px] h-[127.167px] items-start left-[20.67px] pb-[0.667px] pt-[14.667px] px-[14.667px] rounded-[8px] top-[219.83px] w-[680.667px]" data-name="wI">
            <div aria-hidden="true" className="absolute border-[#1e293b] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <HeadingBackgroundImageAndText text="Seed" />
            <div className="h-[52.833px] relative shrink-0 w-full" data-name="Container">
              <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-0 top-0 w-[179.771px]" data-name="yA">
                <LabelBackgroundImageAndText text="Name" additionalClassNames="w-[179.771px]" />
                <BackgroundImage additionalClassNames="w-[179.771px]">
                  <TextInputBackgroundImageAndText text="Seed" additionalClassNames="w-[158.438px]" />
                </BackgroundImage>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-[191.77px] top-0 w-[179.771px]" data-name="yA">
                <LabelBackgroundImageAndText text="Amount" additionalClassNames="w-[179.771px]" />
                <ContainerBackgroundImage>
                  <TextBackgroundImageAndText text="$" />
                  <NumberInputBackgroundImageAndText text="2500000" additionalClassNames="w-[147.198px]" />
                </ContainerBackgroundImage>
              </div>
              <div className="absolute content-stretch flex flex-col gap-[2px] h-[52.833px] items-start left-[383.54px] top-0 w-[179.771px]" data-name="yA">
                <LabelBackgroundImageAndText text="Pre-Money" additionalClassNames="w-[179.771px]" />
                <ContainerBackgroundImage>
                  <TextBackgroundImageAndText text="$" />
                  <NumberInputBackgroundImageAndText text="8000000" additionalClassNames="w-[147.198px]" />
                </ContainerBackgroundImage>
              </div>
              <ButtonBackgroundImageAndText3 text="Remove" />
            </div>
          </div>
          <div className="absolute content-stretch flex gap-[8px] h-[33.333px] items-start left-[20.67px] top-[359px] w-[680.667px]" data-name="wI">
            <ButtonBackgroundImage additionalClassNames="w-[71.688px]">
              <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[35.67px] not-italic text-[#38bdf8] text-[12px] text-center top-[8.67px] whitespace-nowrap">+ SAFE</p>
            </ButtonBackgroundImage>
            <ButtonBackgroundImage additionalClassNames="w-[76.365px]">
              <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-[39.17px] not-italic text-[#38bdf8] text-[12px] text-center top-[8.67px] whitespace-nowrap">+ Priced</p>
            </ButtonBackgroundImage>
          </div>
        </div>
        <div className="bg-[#0f172a] h-[359px] relative rounded-[10px] shrink-0 w-full" data-name="Bt">
          <div aria-hidden="true" className="absolute border-[#1e293b] border-[0.667px] border-solid inset-0 pointer-events-none rounded-[10px]" />
          <div className="content-stretch flex flex-col gap-[4px] items-start pb-[0.667px] pt-[20.667px] px-[20.667px] relative size-full">
            <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 3">
              <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#f1f5f9] text-[16px] top-[-0.33px] whitespace-nowrap">Fully Diluted Cap Table</p>
            </div>
            <div className="h-[289.667px] overflow-clip relative shrink-0 w-full" data-name="Nn">
              <div className="absolute h-[35.5px] left-0 top-0 w-[680.667px]" data-name="Table Header">
                <div className="absolute h-[35.5px] left-0 top-0 w-[680.667px]" data-name="Table Row">
                  <div className="absolute border-[#1e293b] border-b-2 border-solid h-[35.5px] left-0 top-0 w-[179.198px]" data-name="Header Cell">
                    <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[12px] not-italic text-[#94a3b8] text-[11px] top-[10px] uppercase whitespace-nowrap">Holder</p>
                  </div>
                  <div className="absolute border-[#1e293b] border-b-2 border-solid h-[35.5px] left-[179.2px] top-0 w-[138.302px]" data-name="Header Cell">
                    <p className="-translate-x-full absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[126.46px] not-italic text-[#94a3b8] text-[11px] text-right top-[10px] uppercase whitespace-nowrap">Shares</p>
                  </div>
                  <div className="absolute border-[#1e293b] border-b-2 border-solid h-[35.5px] left-[317.5px] top-0 w-[96.885px]" data-name="Header Cell">
                    <p className="-translate-x-full absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[85.48px] not-italic text-[#94a3b8] text-[11px] text-right top-[10px] uppercase whitespace-nowrap">Pre%</p>
                  </div>
                  <div className="absolute border-[#1e293b] border-b-2 border-solid h-[35.5px] left-[414.39px] top-0 w-[96.885px]" data-name="Header Cell">
                    <p className="-translate-x-full absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[85.15px] not-italic text-[#94a3b8] text-[11px] text-right top-[10px] uppercase whitespace-nowrap">Post%</p>
                  </div>
                  <div className="absolute border-[#1e293b] border-b-2 border-solid h-[35.5px] left-[511.27px] top-0 w-[169.396px]" data-name="Header Cell">
                    <p className="-translate-x-full absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16.5px] left-[157.5px] not-italic text-[#94a3b8] text-[11px] text-right top-[10px] uppercase whitespace-nowrap">Notes</p>
                  </div>
                </div>
              </div>
              <div className="absolute h-[253.833px] left-0 top-[35.5px] w-[680.667px]" data-name="Table Body">
                <div className="absolute h-[36.833px] left-0 top-0 w-[680.667px]" data-name="Table Row">
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.833px] left-0 top-0 w-[179.198px]" data-name="Table Cell">
                    <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-[12px] not-italic text-[#cbd5e1] text-[13px] top-[10px] whitespace-nowrap">Founder 1 (CEO)</p>
                  </div>
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.833px] left-[179.2px] top-0 w-[138.302px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[126.97px] not-italic text-[#cbd5e1] text-[13px] text-right top-[9px] whitespace-nowrap">4,500,000</p>
                  </div>
                  <TableCellBackgroundImageAndText text="47.37%" additionalClassNames="left-[317.5px]" />
                  <TableCellBackgroundImageAndText text="33.31%" additionalClassNames="left-[414.39px]" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.833px] left-[511.27px] top-0 w-[169.396px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[157.47px] not-italic text-[#cbd5e1] text-[13px] text-right top-[9px] whitespace-nowrap">4yr/1yr cliff</p>
                  </div>
                </div>
                <div className="absolute bg-[rgba(30,41,59,0.3)] h-[36.167px] left-0 top-[36.83px] w-[680.667px]" data-name="Table Row">
                  <TableCellBackgroundImageAndText1 text="Founder 2 (CTO)" />
                  <TableCellBackgroundImageAndText2 text="3,500,000" />
                  <TableCellBackgroundImageAndText3 text="36.84%" additionalClassNames="left-[317.5px]" />
                  <TableCellBackgroundImageAndText3 text="25.91%" additionalClassNames="left-[414.39px]" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[511.27px] top-0 w-[169.396px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[157.47px] not-italic text-[#cbd5e1] text-[13px] text-right top-[8.33px] whitespace-nowrap">4yr/1yr cliff</p>
                  </div>
                </div>
                <div className="absolute h-[36.167px] left-0 top-[73px] w-[680.667px]" data-name="Table Row">
                  <TableCellBackgroundImageAndText1 text="ESOP" />
                  <TableCellBackgroundImageAndText2 text="1,500,000" />
                  <TableCellBackgroundImageAndText3 text="15.79%" additionalClassNames="left-[317.5px]" />
                  <TableCellBackgroundImageAndText3 text="11.10%" additionalClassNames="left-[414.39px]" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[511.27px] top-0 w-[169.396px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[158.21px] not-italic text-[#cbd5e1] text-[13px] text-right top-[8.33px] whitespace-nowrap">Reserved</p>
                  </div>
                </div>
                <div className="absolute bg-[rgba(30,41,59,0.3)] h-[36.167px] left-0 top-[109.17px] w-[680.667px]" data-name="Table Row">
                  <TableCellBackgroundImageAndText1 text="-- Pre-Total" />
                  <TableCellBackgroundImageAndText2 text="9,500,000" />
                  <TableCellBackgroundImageAndText3 text="100.0%" additionalClassNames="left-[317.5px]" />
                  <TableCellBackgroundImageAndText3 text="70.33%" additionalClassNames="left-[414.39px]" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[511.27px] top-0 w-[169.396px]" data-name="Table Cell" />
                </div>
                <div className="absolute bg-[rgba(12,74,110,0.2)] h-[36.167px] left-0 top-[145.33px] w-[680.667px]" data-name="Table Row">
                  <TableCellBackgroundImageAndText4 text="Pre-Seed SAFE" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[179.2px] top-0 w-[138.302px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[127.26px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">791,667</p>
                  </div>
                  <TableCellBackgroundImageAndText5 text="--" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[414.39px] top-0 w-[96.885px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[85.15px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">5.86%</p>
                  </div>
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[511.27px] top-0 w-[169.396px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[158.06px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">$6.0M cap</p>
                  </div>
                </div>
                <div className="absolute bg-[rgba(12,74,110,0.2)] h-[36.167px] left-0 top-[181.5px] w-[680.667px]" data-name="Table Row">
                  <TableCellBackgroundImageAndText4 text="Seed" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[179.2px] top-0 w-[138.302px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[126.97px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">3,216,146</p>
                  </div>
                  <TableCellBackgroundImageAndText5 text="--" />
                  <TableCellBackgroundImageAndText6 text="23.81%" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[511.27px] top-0 w-[169.396px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[157.51px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">Priced</p>
                  </div>
                </div>
                <div className="absolute bg-[rgba(12,74,110,0.2)] h-[36.167px] left-0 top-[217.67px] w-[680.667px]" data-name="Table Row">
                  <TableCellBackgroundImageAndText4 text="== Post-Total" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[179.2px] top-0 w-[138.302px]" data-name="Table Cell">
                    <p className="-translate-x-full absolute font-['Cousine:Regular',sans-serif] leading-[19.5px] left-[126.82px] not-italic text-[#38bdf8] text-[13px] text-right top-[8.33px] whitespace-nowrap">13,507,813</p>
                  </div>
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[317.5px] top-0 w-[96.885px]" data-name="Table Cell" />
                  <TableCellBackgroundImageAndText6 text="100.0%" />
                  <div className="absolute border-[#1e293b] border-b-[0.667px] border-solid h-[36.167px] left-[511.27px] top-0 w-[169.396px]" data-name="Table Cell" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[78.5px] relative shrink-0 w-full" data-name="Container">
          <PtBackgroundImage additionalClassNames="col-1">
            <div className="h-[16.5px] relative shrink-0 w-full" data-name="Container">
              <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[71.81px] not-italic text-[#64748b] text-[11px] text-center top-px whitespace-nowrap">Total Invested</p>
            </div>
            <div className="h-[30px] relative shrink-0 w-full" data-name="Container">
              <p className="-translate-x-1/2 absolute font-['Cousine:Bold',sans-serif] leading-[30px] left-[71.75px] not-italic text-[#38bdf8] text-[20px] text-center top-[-0.33px] whitespace-nowrap">$3.0M</p>
            </div>
          </PtBackgroundImage>
          <PtBackgroundImage additionalClassNames="col-2">
            <div className="h-[16.5px] relative shrink-0 w-full" data-name="Container">
              <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[72.34px] not-italic text-[#64748b] text-[11px] text-center top-px whitespace-nowrap">Founder %</p>
            </div>
            <ContainerBackgroundImageAndText text="59.22%" />
          </PtBackgroundImage>
          <PtBackgroundImage additionalClassNames="col-3">
            <div className="h-[16.5px] relative shrink-0 w-full" data-name="Container">
              <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[71.76px] not-italic text-[#64748b] text-[11px] text-center top-px whitespace-nowrap">Investor %</p>
            </div>
            <ContainerBackgroundImageAndText text="29.67%" />
          </PtBackgroundImage>
          <PtBackgroundImage additionalClassNames="col-4">
            <div className="h-[16.5px] relative shrink-0 w-full" data-name="Container">
              <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-[72.65px] not-italic text-[#64748b] text-[11px] text-center top-px whitespace-nowrap">ESOP %</p>
            </div>
            <ContainerBackgroundImageAndText text="11.10%" />
          </PtBackgroundImage>
        </div>
      </div>
    </div>
  );
}