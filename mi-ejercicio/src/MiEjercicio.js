import { html, css, LitElement } from 'lit';

export class MiEjercicio extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 25px;
      color: var(--mi-ejercicio-text-color, #000);
    }
    .tb-cont{
      border-collapse: collapse;
      margin-top: 5%;
      width:70%;
    }
    .txt-campo{
      width: 15%;
      padding: 1% 3%;
      border:none;
      border-bottom: 1px black solid;
    }
    .tb-img {
      width: 80%;
      aspect-ratio: 9/10 ;
    }
    .cnt-img{
      padding:0;
      margin: 0;
      width:30%;
      text-align:center;
    }
    .tb-hd{
      background: rgba(55, 180, 242, 0.757);
    }
  `;

  static get properties () {
    return {
        listaPersonajes: { type: Array},
        listaBusqueda : {type:Array},
        texto:{type:String},
        imagenPorDefecto:{type:String}
    }
  }

  constructor() {
    super();
    this.listaPersonajes=[];
    this.listaBusqueda=[];
    this.texto= "";
    this.imagenPorDefecto = 'https://png.pngtree.com/png-vector/20190816/ourlarge/pngtree-film-logo-design-template-vector-isolated-illustration-png-image_1693431.jpg';

  }

  async connectedCallback(){
    super.connectedCallback();
    await this.obtenerDatos();
  }

  async obtenerDatos(){
    try {
      //Realizamos la peticion de la api
      const peticion = await fetch('https://hp-api.onrender.com/api/characters');
      const datos = await peticion.json(); //Una vez esten los datos, aplicamos el metodo json
      this.listaPersonajes = datos;
      this.listaBusqueda = datos;
    } catch (error) {
      console.error('Error a realizar la peticion' , error);
    }
  }

  inputConsoltar(event){
    this.texto = event.target.value; //Obtenemos los datos de la caja de texto para filtrar
    this.texto === ''?  this.obtenerDatos()
                     :this.filtrarDatos(); //Si no hay elementos en la caja, me muestra todos los resultados
  }
  filtrarDatos(){
    //Obtenemos el valor de la caja de texto y separamos cada personaje por el (,)
    const resultado = this.texto.split(',').map((item) => item.trim().toLowerCase());
    this.listaBusqueda = this.listaPersonajes.filter((item) => 
         resultado.includes(item.name.toLowerCase()));
  }
 
  render() {
    return html`
    <section>
      <label>Buscar personaje: <input type="text" class="txt-campo" @input=${this.inputConsoltar} placeholder="Example: Harry Potter,Ron Weasley"></label>
      
    </section>
    
    <table border="1" class="tb-cont">
    <thead class="tb-hd">
      <tr>
        <th>Personaje</th>
        <th>Caracteristicas</th>
      </tr>
    </thead>
    <tbody>
      ${this.listaBusqueda.map(item => html`
        <tr>
          <td class="cnt-img"><img src=${item.image === '' ? this.imagenPorDefecto : item.image} class="tb-img"></td>
          <td>
            <ul>
              <li> <label>Nombre: ${item.name}</label></li>
              <li><label>Especie: ${item.species} </label></li>
              <li><label>Fecha de nacimiento:${item.dateOfBirth} </label></li>
              <li><label>Color de ojos: ${item.eyeColour} </label></li>
              <li><label>Actor que interpreta: ${item.actor} </label></li>
            </ul>
        </td>
        </tr>
      `)}
    </tbody>
  </table>
    `;
  }
}
