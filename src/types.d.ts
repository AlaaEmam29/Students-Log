declare module 'jspdf' {
  class jsPDF {
    constructor();
    save(filename: string): void;
  }
  export = jsPDF;
}

declare module 'jspdf-autotable' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function autoTable(doc: unknown, options: Record<string, unknown>): void;
  export default autoTable;
}
