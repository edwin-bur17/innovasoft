import { Separator } from "@/components/ui/separator";
import { Github } from "lucide-react";

export default function DashboardFooter() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="mt-auto">
			<Separator className="my-8" />

			<div className="pb-8 px-6">
				<div className="max-w-7xl mx-auto flex flex-col gap-2 text-center sm:flex-row sm:justify-between sm:items-center">
					<p className="text-sm text-muted-foreground">
						Innovasoft © {currentYear}. Todos los derechos reservados.
					</p>
					<p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
						Plataforma web desarrollada por{" "}
						<a
							href="https://github.com/edwin-bur17"
							target="_blank"
							rel="noopener noreferrer"
							className="underline hover:text-foreground"
						>
							snydev
						</a>
						<a
							href="https://github.com/edwin-bur17"
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground"
							aria-label="Github"
						>
							<Github className="h-4 w-4" />
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
