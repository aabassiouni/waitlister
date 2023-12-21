import { Toaster } from "@/components/ui/toaster";
import React from "react";

function InviteLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{children}
			<Toaster />
		</>
	);
}

export default InviteLayout;