export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// Empty until we have real feedback from early users - never fill this with
// invented quotes, since displaying fake testimonials to visitors would be
// misleading and could breach UK advertising/consumer protection rules.
export const testimonials: Testimonial[] = [];