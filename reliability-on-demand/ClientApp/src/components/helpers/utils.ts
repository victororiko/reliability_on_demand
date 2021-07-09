
// replacer function that can catch circular objects, and allow JSON.stringy to print circular objects
export const replacerFunc = () => {
    const visited = new WeakSet();
    return (key: any, value: object | null) => {
      if (typeof value === "object" && value !== null) {
        if (visited.has(value)) {
          return;
        }
        visited.add(value);
      }
      return value;
    };
  };