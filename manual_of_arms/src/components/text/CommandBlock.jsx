export default function CommandBlock({ commands }) {
  return (
    <div className="command-block" aria-label="Drill commands">
      {commands.map((cmd, i) => (
        <span key={i} className={`command-block__item ${cmd.type}`}>
          {cmd.text}
        </span>
      ))}
    </div>
  );
}
