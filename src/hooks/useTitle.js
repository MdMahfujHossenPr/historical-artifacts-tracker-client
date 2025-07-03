import { useEffect } from "react";

const useTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | Historical Artifacts Tracker`;
  }, [title]);
};

export default useTitle;
