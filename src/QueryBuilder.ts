export class QueryBuilder extends String {
  constructor(obj: any) {
    const build = (obj: any, parentKey: string) => {
      return Object.keys(obj)
          .map((key): string => {
            const newKey = parentKey ? `${parentKey}[${key}]` : key;
            if (typeof obj[key] === "object" && obj[key] !== null) {
              return build(obj[key], newKey); // Recursively build nested objects
            } else {
              return `${newKey}=${encodeURIComponent(obj[key])}`; // Encode values
            }
          })
          .join('&');
    };

    super(build(obj, ''));
  }
}