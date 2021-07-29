import React from "react";
import { Container, Modal, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
var $ = require("jquery");
require("datatables.net")();
export default class Canzoni extends React.Component {
  constructor() {
    super();

    this.state = {
      canzoni: [],
      mostraDettagli: false,
      branoSelezionato: {}
    };
  }
  componentDidMount() {
    this.aggiorna();
  }

  aggiorna = () => {
    axios
      .get("https://itunes.apple.com/us/rss/topsongs/limit=50/json")
      .then((res) => {
        //console.log(res.data.feed.entry);
        let data = res.data.feed.entry;

        let canzoni = [];
        let canzone = {};
        let mesi = [
          "Gennaio",
          "Febbraio",
          "Marzo",
          "Aprile",
          "Maggio",
          "Giugno",
          "Luglio",
          "Agosto",
          "Settembre",
          "Ottobre",
          "Novembre",
          "Dicembre"
        ];

        for (let i = 0; i < data.length; i++) {
          //formatto la data
          let uscita = data[i]["im:releaseDate"]
            ? new Date(data[i]["im:releaseDate"].label)
            : undefined;

          if (uscita !== undefined) {
            let giorno = uscita.getDate();
            let mese = uscita.getMonth();
            let anno = uscita.getFullYear();
            uscita = giorno + " " + mesi[mese] + " " + anno;
          } else {
            uscita = "data non disponibile";
          }
          canzone = {
            immagine: data[i]["im:image"][2].label,
            cantante: data[i]["im:artist"].label,
            titoloBrano: data[i]["im:name"].label,
            prezzo: data[i]["im:price"].label,
            categoria: data[i].category.attributes.label,
            dataUscita: uscita,
            produttore: data[i].rights.label
          };
          canzoni.push(canzone);
        }
        //console.log(canzoni);
        this.setState({
          canzoni: canzoni
        });

        $("#tabella").DataTable({
          language: {
            url: "//cdn.datatables.net/plug-ins/1.10.24/i18n/Italian.json"
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  dettagliBrano = (brano) => {
    this.setState({ mostraDettagli: true, branoSelezionato: brano });
  };

  render() {
    return (
      <Container align="center">
        <Modal
          show={this.state.mostraDettagli}
          animation={true}
          onHide={() => this.setState({ mostraDettagli: false })}
        >
          <Modal.Header>
            <Col>
              <h1>{this.state.branoSelezionato.titoloBrano} </h1>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <Row>
              <Col align="center">
                <img
                  src={this.state.branoSelezionato.immagine}
                  alt="copertina"
                  width="160"
                  height="160"
                />
              </Col>
            </Row>
            <Row>
              <Col align="center">
                Cantante : {this.state.branoSelezionato.cantante}
              </Col>
            </Row>
            <Row>
              <Col align="center">
                Produttore : {this.state.branoSelezionato.produttore}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ mostraDettagli: false })}
            >
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>
        <span className="titolo">Elenco Canzoni</span>

        <table id="tabella">
          <thead>
            <tr>
              <th>Copertina Album </th>
              <th>Nome cantante</th>
              <th>Titolo del brano</th>
              <th>Prezzo</th>
              <th>Categoria</th>
              <th>Data Uscita</th>
            </tr>
          </thead>
          <tbody>
            {this.state.canzoni.map((item, index) => (
              <tr onClick={() => this.dettagliBrano(item)} key={index}>
                <td>
                  <img
                    src={item.immagine}
                    alt="copertina"
                    width="100"
                    height="100"
                  />
                </td>
                <td>{item.cantante}</td>
                <td>{item.titoloBrano}</td>
                <td>{item.prezzo}</td>
                <td>{item.categoria}</td>
                <td>{item.dataUscita}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    );
  }
}
