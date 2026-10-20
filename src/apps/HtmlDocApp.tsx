import { useMemo } from "react";
import { filesystemNode, filesystemTrail } from "../data/filesystem";
import { useWindowChrome } from "../components/WindowChrome";

/** A static HTML document from the file tree, read inside a regular OS window. */
export function HtmlDocApp({ nodeId }: { nodeId?: string }) {
  const node = nodeId ? filesystemNode(nodeId) : undefined;
  const chrome = useMemo(
    () => ({ trail: nodeId ? filesystemTrail(nodeId).map((n) => ({ label: n.name })) : [], meta: "HTML" }),
    [nodeId],
  );
  useWindowChrome(chrome);
  if (!node?.html) return null;
  return (
    <div className="html-doc">
      <iframe src={node.html} title={node.name} />
    </div>
  );
}
