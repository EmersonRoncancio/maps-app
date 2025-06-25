import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl, { Map } from 'mapbox-gl';
import { environment } from '../../../../../environments/environment';

mapboxgl.accessToken = environment.mapsApp;
interface Coordinates {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniMapComponent implements OnInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  cordinates = input.required<Coordinates>();
  zoom = signal(14);

  async ngOnInit() {
    if (!this.divElement()?.nativeElement) return;
    const mapContainer = this.divElement()?.nativeElement;

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 80);
    });

    const { lat, lng } = this.cordinates();
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
      interactive: false, // Disable interaction for mini-map
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

    this.mapListener(map);
  }

  mapListener(map: Map) {
    this.map.set(map);
  }
}
