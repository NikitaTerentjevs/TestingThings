
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy
} from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  templateUrl: `./app-counter.html`,
  styles: [`
    :host {
      display: inline-block;
      font-variant-numeric: tabular-nums;
    }
  `]
})
export class CounterComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) count = 0;
  @Input() suffix = '';
  @Input() duration = 1100;


  displayValue = 0;

  private observer?: IntersectionObserver;
  private started = false;
  private intervalId?: ReturnType<typeof setInterval>;


  constructor(
    private element: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef  
  ) {
    
  }

  ngAfterViewInit(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          this.startAnimation();
          this.observer?.disconnect();
        }
      }, { threshold: 0.4 });

      this.observer.observe(this.element.nativeElement);
    } else {
      this.startAnimation();
    }
  }

  
  private startAnimation(): void {
    if (this.started) return;
    this.started = true;

    const target = Number(this.count);

    if (!Number.isFinite(target)) {
      this.displayValue = 0;
      return;
    }

    const startTime = Date.now();
    const duration = Math.max(1, this.duration);

    this.intervalId = setInterval(() => {
      const progress = Math.min(
        1,
        (Date.now() - startTime) / duration
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      this.displayValue = Math.round(target * eased);
      this.cdr.detectChanges();

      if (progress >= 1) {
        this.displayValue = target;
        this.cdr.detectChanges();

        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }
    }, 16);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();

    if (this.intervalId !== undefined) {
      clearInterval(this.intervalId);
    }
  }
}
