import HeaderClient from "./HeaderClient";
import { fetchGeneralInfo } from "@/lib/api";



export async function Header() {
  const generalInfo = await fetchGeneralInfo();

  return (
    <HeaderClient generalInfo={generalInfo} />
  )
}