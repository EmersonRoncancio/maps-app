import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { JsonPipe } from '@angular/common';
mapboxgl.accessToken = environment.mapsApp;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  cordinates = signal({ lat: 4.121415, lng: -73.565459 });
  markers = signal<Marker[]>([]);
  colortin = signal('secondary');

  zoom = signal(18);

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

    map.on('click', (event) => {
      console.log(event.lngLat);
      this.mapClick(event);
    });

    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color: color,
    })
      .setLngLat(event.lngLat)
      .addTo(this.map()!);

    this.markers.update((prevMarkers) => {
      const newMarkerData: Marker = {
        id: crypto.randomUUID(),
        mapboxMarker: newMarker,
      };
      return [...prevMarkers, newMarkerData];
    });

    console.log('Marker added:', this.markers());

    localStorage.setItem('MARKERS', JSON.stringify(this.markers()));
  }

  flyToMarker(marker: LngLatLike) {
    if (!this.map()) return;

    this.map()?.flyTo({
      center: marker,
      zoom: 18,
    });
  }
}
