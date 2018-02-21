import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Route, Switch, Redirect } from 'react-router'
import PageWrapper from '../../components/PageWrapper'
import APP_CONFIG from '../../../../app.json'
import path from 'path';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";

// import '../../sdk'
//const { socket, rest } = window.calponia
//const CREDENTIALS = cookie.get('calponia')
//const PROJECT_ID = (CREDENTIALS || { projectId: 'dbf6c972-0719-11e8-93f3-9b991345630e' }).projectId
// const PROJECT_ID = "a9908c7c-d1f3-11e7-9856-8fd4deaffec9"
//const MapboxAccessToken = "pk.eyJ1IjoiYXNjaGVzY2hsZWllciIsImEiOiJjamR3emk3cnEwZWRnMndvMXd6Ymo3eTA0In0.Y1n4sTGtftDhWL41cgP3kw"

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoiYXNjaGVzY2hsZWllciIsImEiOiJjamR3emk3cnEwZWRnMndvMXd6Ymo3eTA0In0.Y1n4sTGtftDhWL41cgP3kw"
});


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      vehicles: [],

    }
  }

  loadVehicles() {
    const query = {
      include: {
        relation: 'vehicles',
        scope: { include: { relation: 'equipment', scope: { where: { 'iotDevice': true } } } }
      }
    }

    // rest().get(`/projects/${PROJECT_ID}/?access_token=${ACCESS_TOKEN}&filter=${encodeURIComponent(JSON.stringify(query))}`)
    if (!APP_CONFIG.DEVELOPMENT) {

      rest().get(`/projects/${PROJECT_ID}/?filter=${encodeURIComponent(JSON.stringify(query))}`)
        .then(({ vehicles }) => {
          console.log("VEHICLES FRESH DB")
          this.setState({ vehicles })
        })
    } else {
      this.setState({ vehicles: [{ "id": "4b574aca-0b6c-11e8-9ba2-f3930076c5b0", "projectId": "33af28fc-0b6c-11e8-a6f8-139a9e0e5ebf", "assetDirectoryId": "4b5c76e4-0b6c-11e8-a6f8-d73270465e3f", "identifier": "1", "licensePlate": "WDX-SIM001D\t", "chassisNumber": "WDX-SIM001D\t", "image": "dbca0615b188abac02cc28fd8a72588e", "manufacturer": "", "model": "", "available": true, "responsible": "", "engine": "Gasoline", "power": "", "modelYear": "", "lat": 48.9059, "long": 9.0811, "timestamp": "2018-02-12T14:07:33.481Z", "template": true, "createdBy": "4b0cdc1e-f600-11e7-8e40-c7772bcbc155", "createdAt": "2018-02-06T18:33:58.316Z", "updatedAt": "2018-02-12T14:07:34.019Z" }, { "id": "928f05fe-0b6c-11e8-b3ff-abaeae187644", "projectId": "33af28fc-0b6c-11e8-a6f8-139a9e0e5ebf", "assetDirectoryId": "9297e7d2-0b6c-11e8-87f0-eb9a9b80496b", "identifier": "2", "licensePlate": "WDX-SIM001", "chassisNumber": "WDX-SIM001", "image": null, "manufacturer": "", "model": "", "available": true, "responsible": "", "engine": "Gasoline", "power": "", "modelYear": "", "lat": 49.0748, "long": 9.3004, "timestamp": "2017-09-19T15:52:42.000Z", "template": true, "createdBy": "4b0cdc1e-f600-11e7-8e40-c7772bcbc155", "createdAt": "2018-02-06T18:35:57.800Z", "updatedAt": "2018-02-08T16:19:57.804Z" }, { "id": "9cd6ad5a-0b6c-11e8-87f0-b387adfd6665", "projectId": "33af28fc-0b6c-11e8-a6f8-139a9e0e5ebf", "assetDirectoryId": "9ce429c6-0b6c-11e8-a6f8-cbd687d982a0", "identifier": "3", "licensePlate": "WD1TEST1234", "chassisNumber": "WD1TEST1234", "image": null, "manufacturer": "", "model": "", "available": true, "responsible": "", "engine": "Gasoline", "power": "", "modelYear": "", "lat": null, "long": null, "timestamp": null, "template": true, "createdBy": "4b0cdc1e-f600-11e7-8e40-c7772bcbc155", "createdAt": "2018-02-06T18:36:15.047Z", "updatedAt": "2018-02-06T18:36:15.047Z" }, { "id": "a42fcda2-0b6c-11e8-b3ff-07c8e1a970da", "projectId": "33af28fc-0b6c-11e8-a6f8-139a9e0e5ebf", "assetDirectoryId": "a43321d2-0b6c-11e8-87f0-5b7f80a53871", "identifier": "4", "licensePlate": "WBAFW11090D263459", "chassisNumber": "WBAFW11090D263459", "image": null, "manufacturer": "", "model": "", "available": true, "responsible": "", "engine": "Gasoline", "power": "", "modelYear": "", "lat": null, "long": null, "timestamp": null, "template": true, "createdBy": "4b0cdc1e-f600-11e7-8e40-c7772bcbc155", "createdAt": "2018-02-06T18:36:27.374Z", "updatedAt": "2018-02-06T18:36:27.374Z" }, { "id": "ab11d868-0b6c-11e8-857b-d7c7cf93b434", "projectId": "33af28fc-0b6c-11e8-a6f8-139a9e0e5ebf", "assetDirectoryId": "ab18b7be-0b6c-11e8-a56a-63ca797ff211", "identifier": "5", "licensePlate": "VSKDDAC13U0067815", "chassisNumber": "VSKDDAC13U0067815", "image": null, "manufacturer": "", "model": "", "available": true, "responsible": "", "engine": "Gasoline", "power": "", "modelYear": "", "lat": 49.152, "long": 9.3013, "timestamp": "2018-02-02T16:39:26.000Z", "template": true, "createdBy": "4b0cdc1e-f600-11e7-8e40-c7772bcbc155", "createdAt": "2018-02-06T18:36:38.922Z", "updatedAt": "2018-02-12T10:03:09.111Z" }, { "id": "b2b2a34a-0b6c-11e8-a6aa-bf40dc857e3a", "projectId": "33af28fc-0b6c-11e8-a6f8-139a9e0e5ebf", "assetDirectoryId": "b2b85e02-0b6c-11e8-a6f8-0f1c81fbf312", "identifier": "6", "licensePlate": "GIUTEST1234", "chassisNumber": "GIUTEST1234", "image": null, "manufacturer": "", "model": "", "available": true, "responsible": "", "engine": "Gasoline", "power": "", "modelYear": "", "lat": 49.0763, "long": 9.3063, "timestamp": "2018-02-02T08:31:04.000Z", "template": true, "createdBy": "4b0cdc1e-f600-11e7-8e40-c7772bcbc155", "createdAt": "2018-02-06T18:36:51.720Z", "updatedAt": "2018-02-12T08:47:22.262Z" }] })
    }
  }

  componentDidMount() {
    // force rerender every second to update connected status of vehicles which have timed out
    // this._refreshInterval = setInterval(() => {
    //   this.forceUpdate()
    //   this.loadVehicles()
    // }, 1000)

    //this.loadVehicles()
  }

  // componentWillUnmount () {
  //   clearInterval(this._refreshInterval)
  // }

  render() {
    const { vehicles } = this.state

    return (
      <BrowserRouter>
        <PageWrapper>
          <Map
            style="mapbox://styles/mapbox/streets-v9"
            containerStyle={{
              height: "100vh",
              width: "100vw"
            }}>
            <Layer
              type="symbol"
              id="marker"
              layout={{ "icon-image": "marker-15" }}>
              <Feature coordinates={[52.497687,13.3726634]} />
            </Layer>
          </Map>

        </PageWrapper>
      </BrowserRouter>
    )
  }
}

export default App