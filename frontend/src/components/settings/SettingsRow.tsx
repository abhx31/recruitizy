interface SettingsRowProps {

  label: string;

  value: string;
}

export function SettingsRow({
  label,
  value,
}: SettingsRowProps) {

  return (

    <div
      className="
        flex items-center
        justify-between

        border-b border-border/50

        pb-4

        last:border-none
        last:pb-0
      "
    >

      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm font-medium
        "
      >
        {value}
      </p>

    </div>
  );
}