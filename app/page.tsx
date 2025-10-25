import HomeTemplates from "@/components/templates/HomeTemplate";
import { getAllAmbassador } from "@/services/db/ambassador";

export default async function HomePage() {
  const ambassadorData = await getAllAmbassador();

  return <HomeTemplates ambassadorData={ambassadorData} />;
}
