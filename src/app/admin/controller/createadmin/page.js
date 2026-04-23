import { redirect } from "next/navigation";

export default function CreateAdminRedirect() {
  redirect("/superadmin");
}
