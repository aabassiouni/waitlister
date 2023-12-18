import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import EmailPreview from "@/components/email-preview";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getEmailTemplateForUser, setEmailTemplateForUser } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import FormSubmitButton from "@/components/form-submit-button";
import { currentUser } from "@clerk/nextjs";
import { PageHeading } from "@/components/typography";

async function EmailPreviewPage({ params }: { params: { waitlist: string } }) {
	const user = await currentUser();

	if (!user) return;

	const values = await getEmailTemplateForUser(params.waitlist, user.id);

	async function submitEmailTemplate(formData: FormData) {
		"use server";
		await setEmailTemplateForUser({
			waitlistID: params.waitlist,
			userID: user!.id,
			subject: formData.get("subject"),
			bodyText: formData.get("body"),
			header: formData.get("header"),
		});
		revalidatePath("/email-preview");
	}

	async function clearEmailTemplate() {
		"use server";
		console.log("cleaering email template")
		await setEmailTemplateForUser({
			waitlistID: params.waitlist,
			userID: user!.id,
			subject: null,
			bodyText: null,
			header: null,
		});
		revalidatePath("/email-preview");
		console.log("cleared email template")
	}

	return (
		<div className="flex w-full">
			<div className="w-1/2 p-10">
				<PageHeading>Email Preview</PageHeading>
				<div className="space-y-2">
					<form className="space-y-2" action={submitEmailTemplate}>
						<div>
							<Label htmlFor="email">Email Subject</Label>
							<Input
								defaultValue={values[0]?.subject ?? ""}
								name="subject"
								id="subject"
								className="my-1 w-1/4"
							/>
						</div>
						<div>
							<Label htmlFor="email">Header</Label>
							<Input
								defaultValue={values[0]?.header ?? ""}
								name="header"
								id="header"
								className="my-1 w-1/4"
							/>
						</div>
						<div>
							<Label htmlFor="bodyText">Body</Label>
							<Textarea
								defaultValue={values[0]?.bodyText ?? ""}
								name="body"
								id="bodyText"
								className="h-32 w-full"
							/>
						</div>
						<FormSubmitButton className="w-20 dark:bg-primary dark:hover:bg-primary/80">
							Submit
						</FormSubmitButton>
					</form>
					<form action={clearEmailTemplate}>
						<FormSubmitButton className="w-fit ">Reset to default</FormSubmitButton>
					</form>
				</div>
			</div>
			<div className="w-1/2 py-8 pr-10">
				<Suspense fallback={<Skeleton className="h-full" />}>
					<EmailPreview waitlistID={params.waitlist} />
				</Suspense>
			</div>
		</div>
	);
}

export default EmailPreviewPage;
