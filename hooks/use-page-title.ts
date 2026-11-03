import { useEffect } from "react";

/**
 * Every route owns its title, e.g. "BookNook | All Books".
 * The hook keeps the title in sync without remounting the page.
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `BookNook | ${title}` : "BookNook";
  }, [title]);
}
