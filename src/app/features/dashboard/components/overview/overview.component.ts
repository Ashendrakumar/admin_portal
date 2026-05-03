import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-overview",
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./overview.component.html",
  styleUrl: "./overview.component.scss",
})
export class OverviewComponent implements OnInit {
  readonly Math = Math;

  readonly statsData = signal([
    {
      id: 1,
      title: "Total Users",
      value: 2547,
      change: 12,
      icon: "👥",
      color: "blue",
      chartPoints: [40, 60, 50, 80, 45, 75, 65],
    },
    {
      id: 2,
      title: "Active Sessions",
      value: 348,
      change: 8,
      icon: "🔌",
      color: "cyan",
      chartPoints: [30, 50, 70, 60, 75, 80, 85],
    },
    {
      id: 3,
      title: "API Requests",
      value: "42.5K",
      change: -3,
      icon: "⚙️",
      color: "amber",
      chartPoints: [85, 75, 80, 65, 70, 75, 80],
    },
    {
      id: 4,
      title: "System Uptime",
      value: "99.9%",
      change: 0.2,
      icon: "✅",
      color: "emerald",
      chartPoints: [95, 98, 99, 98, 99, 99, 100],
    },
  ]);

  readonly recentActivities = signal([
    {
      id: 1,
      title: "All systems operational",
      time: "2 hours ago",
      status: "online",
    },
    {
      id: 2,
      title: "Database optimization running",
      time: "5 hours ago",
      status: "warning",
    },
    {
      id: 3,
      title: "Backup completed successfully",
      time: "1 day ago",
      status: "online",
    },
    {
      id: 4,
      title: "Maintenance window scheduled",
      time: "2 days ago",
      status: "offline",
    },
  ]);

  ngOnInit(): void {
    // Simulated data updates
    setInterval(() => {
      const stats = this.statsData();
      stats[0].value = Math.floor(Math.random() * 3000) + 2000;
      stats[1].value = Math.floor(Math.random() * 500) + 200;
      this.statsData.set([...stats]);
    }, 5000);
  }
}
