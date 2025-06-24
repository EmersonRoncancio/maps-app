import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapsApp;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    #controls {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `,
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');

  zoom = signal(14);
  map = signal<mapboxgl.Map | null>(null);
  cordinates = signal({ lat: 40, lng: -74.5 });

  zoomEffect = effect(() => {
    if (!this.map()) return;
    this.map()?.setZoom(this.zoom());
  });

  ngAfterViewInit(): void {
    if (!this.divElement()) return;
    const mapContainer = this.divElement()?.nativeElement;

    const { lat, lng } = this.cordinates();
    const map = new mapboxgl.Map({
      container: mapContainer, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });
    this.mapListener(map);
  }

  mapListener(map: mapboxgl.Map) {
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });

    map.on('moveend', (event) => {
      const center = event.target.getCenter();
      this.cordinates.set({ lat: center.lat, lng: center.lng });
    });

    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    this.map.set(map);
  }

  onZoomChange(arg0: string) {
    console.log('Zoom changed:', arg0);
    this.zoom.set(Number(arg0));
  }
}
