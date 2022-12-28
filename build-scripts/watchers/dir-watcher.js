import chokidar from "chokidar";

// file watcher event names
const ADD = "add",
  CHANGE = "change",
  READY = "ready",
  ERROR = "error";

function watchDir(dir, onAdd, onChange) {
  const watcher = chokidar.watch(dir, {
    persistent: true
  });

  watcher
    .on(READY, () => console.info(`Watching ${dir} for changes...`))
    .on(ADD, path => onAdd(path))
    .on(CHANGE, path => onChange(path))
    .on(ERROR, error => console.error(`Something went wrong while watching ${dir}: ${error}`));
}

export { watchDir };
