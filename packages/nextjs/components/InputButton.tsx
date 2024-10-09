import { FocusEvent, useEffect, useRef } from "react";

type InputButtonProps<T> = {
  error?: boolean;
  reFocus?: boolean;
  paused?: boolean;
  onClick: (str: string | null) => void;
  btnLabel: string;
  value: T;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  Icon?: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
      title?: string;
      titleId?: string;
    } & React.RefAttributes<SVGSVGElement>
  > | null;
  IconTitle?: string;
  IconClass?: string;
  position: "before" | "after";
  useInput: boolean;
};

export const InputButton = <T extends { toString: () => string } | undefined = string>({
  name,
  value,
  placeholder,
  error,
  disabled,
  reFocus,
  paused,
  onClick,
  btnLabel,
  Icon,
  IconClass,
  IconTitle,
  position,
  useInput,
}: InputButtonProps<T>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const pausedMsg = paused ? <div className="badge">* Contract Paused</div> : null;
  const pausedClass = paused ? "btn-disabled" : "";

  let modifier = "";
  if (error) {
    modifier = "border-error";
  } else if (disabled) {
    modifier = "border-disabled bg-base-300";
  }

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (reFocus) {
      e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length);
    }
  };

  useEffect(() => {
    if (reFocus) inputRef.current?.focus();
  }, [reFocus]);

  const clickCallback = () => {
    onClick(inputRef.current?.value || null);
  };

  return (
    <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl indicator">
      <div className={`flex border-2 border-base-300 bg-base-200 rounded-full text-accent ${modifier}`}>
        {useInput && <input
          className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
          placeholder={placeholder}
          name={name}
          defaultValue={value?.toString()}
          disabled={disabled}
          autoComplete="off"
          ref={inputRef}
          onFocus={onFocus}
          aria-label={name}
        />}

        <button
          className={`btn btn-primary h-[2.2rem] min-h-[2.2rem] ${pausedClass}`}
          onClick={clickCallback}
          aria-label={btnLabel}
        >
          {position === "before" && Icon && <Icon title={IconTitle} className={IconClass} />}
          {btnLabel}
          {position === "after" && Icon && <Icon title={IconTitle} className={IconClass} />}
        </button>
      </div>
      {pausedMsg}
    </div>
  );
};
