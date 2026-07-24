export default function Loading() {
  return (
    <main className="loadingPage" aria-busy="true">
      <div className="loadingHeader">
        <span className="loadingLine loadingLineShort" />
        <span className="loadingLine loadingLineTitle" />
        <span className="loadingLine loadingLineBody" />
      </div>
      <div className="loadingGrid">
        <span className="loadingCard" />
        <span className="loadingCard" />
        <span className="loadingCard" />
      </div>
      <span className="loadingPanel" />
    </main>
  );
}
