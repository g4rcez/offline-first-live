import { useEffect, useState } from "react";

export enum ConnectionType {
  Online = "online",
  Offline = "offline",
}

type Props = {
  online?: () => void;
  offline?: () => void;
};

export const useNetwork = (props?: Props): ConnectionType => {
  const [state, setState] = useState<ConnectionType>(
    window.navigator.onLine ? ConnectionType.Online : ConnectionType.Offline,
  );

  useEffect(() => {
    const onOnline = () => {
      setState(ConnectionType.Online);
      props?.online?.()
    }
    const onOffline = () => {
      setState(ConnectionType.Offline);
      props?.offline?.()
    }
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return state;
};
