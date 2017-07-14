/**
*
* Propietario y Programador
* Daniel Alcalde Romera
*
**/


var ancho = 0;
var alto = 0;
var minas = 0;
var banderas = 0;

var tablero = new Array();
var coloresFondo = ["black", "white", "white", "white", "white", "white", "white", "white", "white", "white"];
var coloresNum = ["white", "#0101DF", "#088A29", "#DF0101", "#0B0B61", "#DF7401", "#B40486", "#FFBF00", "#3B240B"];
asignaEventos();

function asignaEventos(){
	$('#co').click(
			function(){
				generaTablero($('#dificil').val());
			}
		);
    
  //document.oncontextmenu = function(){return false}
}

function generaTablero(tam){
	
	if(tam == 'f'){
		ancho = 8;
		alto = 8;
		minas = 10;
		banderas = 10;
	}
	else if(tam == 'i'){
		ancho = 16;
		alto = 16;
		minas = 40;
		banderas = 40;
	}
	else if(tam == 'd'){
		ancho = 31;
		alto = 16;
		minas = 99;
		banderas = 99;
	}

	//console.log(tam +" " + ancho +" "+ alto);
  
  //llamada a funcion que genera el array del tablero
  generaTableroA();
 
  
  
}

function generaTableroA(){
  var m = minas;
  for(var i = 0; i < alto;i++){
    tablero[i]=new Array();
    for(var j = 0; j < ancho;j++){
      tablero[i][j]=0;
    }
  }
  //console.log(tablero);
  for(var i = 0; i < m;i++){
    var x = Math.floor(Math.random() * (alto - 0)) + 0;
    var y = Math.floor(Math.random() * (ancho - 0)) + 0;
    //console.log(x +" " + y);
    if(tablero[x][y] == 0){
      tablero[x][y]="*";
      
    }
    else{
      
      i--;
    }
  }
  //muestra
  var muestra = "";
  for(var i = 0; i < alto;i++){
    for(var j = 0; j < ancho;j++){
      
      if(tablero[i][j] != "*"){
        
        tablero[i][j] = cuentaMinas(i, j);
        
      }
      muestra += " " + tablero[i][j];
    }
    muestra += "\n";
  }
  
  //console.log(muestra);
  
  //llamada a la funcion que genera
  generaTableroT();
}

function generaTableroT(){
  var tabla = document.createElement("table");
  tabla.style.border = "1px solid black";
  tabla.style.background ="#1dba41";
  for(var i = 0; i < alto; i++){
    var tr = document.createElement("tr");
    for(var j = 0; j < ancho;j++){
      var td = document.createElement("td");
      td.id = i + "," + j;
      $(td).attr("class","boton");
      td.style.border = "1px solid black";
      td.style.height = "20px";
      td.style.width = "20px";
      td.style.textAlign = "center";
      $(td).click(function(event){
          if($(event.target).attr("class").split(" ")[1] !== "bandera"){
            compMina(event);
          }
        });
      $(td).contextmenu(function(event){ 
      if($(event.target).attr("class").split(" ")[1] !== "descubierto"){
        if($(event.target).attr("class").split(" ")[1] === "bandera"){
          banderas++;
          $(".nBanderas").html(banderas);
          $(event.target).toggleClass("bandera");
        }
        else if (banderas > 0){
          banderas--;
          $(".nBanderas").html(banderas);
          $(event.target).toggleClass("bandera");
        }
        
		if(banderas === 0){
		  compVictoria();  
		}
      }
        
        return false;
      });
      
      
      tr.appendChild(td);
    }
    tabla.appendChild(tr);
  }
  
  $("#cont").html("");
  $("#cont").append(tabla);
  $("#cont").append("<div class='nBanderas'>" + banderas + "</div>");
  $("#cont").append("<button type='button' id='volv'>Volver</button>");
  $("#volv").click(function(){location.reload();});
  $("body").contextmenu(function(){return false;});
}

/**
*
*Algoritmo que recorre el perimetro de la casilla de las coordenadas 
*que reciba como "x" e "y" y devuelve el numero de minas que encuentre
*
**/
function cuentaMinas(x, y){
  var contador = 0;
  for(var i = -1; i < 2; i++){
    
    var xa = x + i;
    
    if(xa >= 0 && xa < alto){
      
      for(var j = -1;j <2; j++){
        
        var ya = y + j;
        
        if(ya >= 0 && ya < ancho){
          
          if(tablero[xa][ya] === "*"){
            contador++;
          }
          
        }
      
      }
      
    }
    
  }
    
    
  return contador;
  
}

function compMina(eve){
  //console.log(eve.target.id);
  var posis = eve.target.id.split(",");
  var x = posis[0];
  var y = posis[1];
  //console.log(x + "," + y);
  if(tablero[x][y] === "*"){
    /**
    *
    *Aqui falta realizar funcion de Game Over
    *
    */
    alert("has perdido");
    
  }
  else{
    $(eve.target).addClass("descubierto");
    var tdid=x+","+y;
    var valor = tablero[x][y];
    //$(tdid).val("<p>" + valor + "</p>");
    var tdP =document.getElementById(tdid);
    tdP.class = "descubierto";
    tdP.innerHTML = valor;
    $(tdP).css({
      "background-color":"white",
      "color":coloresNum[valor]
    });
    
    if(valor == 0){
      propagacion(x,y);
    }
    //console.log(tdid + " " + valor);
  }
}

function propagacion(x, y){
  $(document.getElementById(x+","+y)).addClass("comprobado");
  for(var i = -1; i <= 1; i++){
    
    for(var j = -1; j <=1;j++){
      if((parseInt(x)+i) >= 0 && (parseInt(y)+j) >=0 && (parseInt(x)+i) < alto && (parseInt(y)+j) < ancho){
        //console.log((x+i+","+ y+j))
        compvalor(parseInt(x)+i, parseInt(y)+j);
          
        
      }
      
      
    }
    
  }
  
}

function compvalor(x, y){
  //console.log(eve.target.id);
 /* var posis = eve.target.id.split(",");
  var x = posis[0];
  var y = posis[1];*/
  //console.log(x + "," + y);
  if(tablero[x][y] === "*"){
    
  }
  else{
    $(document.getElementById(x+","+y)).addClass("descubierto");
    var tdid=x+","+y;
    var valor = tablero[x][y];
    //$(tdid).val("<p>" + valor + "</p>");
    var tdP =document.getElementById(tdid);
    tdP.class = "descubierto";
    tdP.innerHTML = valor;
    $(tdP).css({
      "background-color":"white",
      "color":coloresNum[valor]
    });
    //console.log($(document.getElementById(x+","+y)).attr("class"));
    if(valor == 0 && $(document.getElementById(x+","+y)).attr("class").split(" ")[2] != "comprobado"){
      //console.log("descubierto");
      
      propagacion(x,y);
      
    }
    //console.log(tdid + " " + valor);
  }
}

function compVictoria(){
	var contBan = 0;
	$("td.bandera").each(
		function(){
			var idt = $(this).attr("id").split(",");
			if(tablero[idt[0]][idt[1]] == "*"){
				contBan++;
			}
			
		}
	)	
	
	if(contBan == minas){
		//desarrollar victoria por aqui
		alert("Victoria!");	
	}
}