"use client";

const MATERIAL_SYMBOLS_URL =
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1&display=swap";

export default function MaterialSymbolsStylesheet() {
  return (
    <>
      <link rel="preload" as="style" href={MATERIAL_SYMBOLS_URL} />
      <link
        rel="stylesheet"
        href={MATERIAL_SYMBOLS_URL}
        media="print"
        onLoad={(event) => {
          event.currentTarget.media = "all";
        }}
      />
      <noscript>
        <link rel="stylesheet" href={MATERIAL_SYMBOLS_URL} />
      </noscript>
    </>
  );
}
