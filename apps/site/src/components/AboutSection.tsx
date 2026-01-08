import { WaitlistButton } from "./WaitlistForm";
import { WaitlistModal } from "./WaitlistModal";
import { useWaitlist } from "./WaitlistProvider";

export function AboutSection() {
  const { isModalOpen, openModal, closeModal } = useWaitlist();

  return (
    <section className="h-[100vh] bg-background px-6 py-24 sm:py-32 flex items-center justify-center">
      <div className="mx-auto max-w-2xl lg:max-w-4xl flex flex-col items-center">
        <h2 className="text-4xl font-bold tracking-tight lg:text-[5rem] mb-6 text-center">
          <span className="text-primary">
            Sushi at the Speed of Life
          </span>
        </h2>
        <div className="space-y-6 text-lg leading-8 text-muted-foreground text-center mb-12">
          <p>
            Enjoying food should be effortless. We realized that to truly modernize the idea, we couldn&apos;t just fix the packaging. We had to fix the experience. Traditional dining is analog and slow; we built Sushi Rabo to be digital and fluid.
          </p>
          <p>
            Sushi Rabo is a technology-first startup aiming to re-engineer the munch break. By combining an intuitive ordering OS with our sustainable push-tube design, we eliminate the queues, the wait, and the mess. 
          </p>
          <p>
            We don&apos;t just deliver maki. We deliver an experience.
          </p>
        </div>

        <div className="w-full max-w-lg">
          <WaitlistButton onClick={openModal} size="lg" className="w-full" />
        </div>
      </div>
      
      {/* Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
}
