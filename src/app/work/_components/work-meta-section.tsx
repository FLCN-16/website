import { workMetaColumns } from "./work-content";

export default function WorkMetaSection() {
  return (
    <section className="work-meta-grid border-t border-outline-variant pt-08">
      {workMetaColumns.map((column) => (
        <div key={column.title} className="flex flex-col gap-04">
          <h3 className="font-mono text-label-sm text-outline">{column.title}</h3>

          {column.emphasis ? (
            <a
              href={`mailto:${column.emphasis}`}
              className="font-body text-body-md font-bold text-primary underline decoration-primary underline-offset-2"
            >
              {column.emphasis}
            </a>
          ) : (
            <ul className="flex flex-col gap-02 text-body-md text-primary-container">
              {column.lines.map((line) => (
                <li key={line} className="font-body">
                  {column.title === "CORE FOCUS" ? (
                    <span className="mr-02 text-primary">•</span>
                  ) : null}
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
