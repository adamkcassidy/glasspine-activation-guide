import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RESIDENT } from '@/lib/resident'

export function WelcomePage() {
  return (
    <div className="animate-soft-rise space-y-4 lg:pt-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Welcome home, {RESIDENT.firstName}.
      </h1>
      <p className="max-w-md text-base leading-relaxed text-muted-foreground">
        A few short steps to get {RESIDENT.unit} set up at {RESIDENT.community}.
      </p>
      <Button asChild size="lg" className="mt-2">
        <Link to="/checklist">
          Start move-in checklist
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
