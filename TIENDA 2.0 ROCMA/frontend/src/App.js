import Chatbot from './Chatbot';
import React, { useState } from 'react';

const bgFerreteria = 'https://images.unsplash.com/photo-1515165562835-cf7747d3f7b1?auto=format&fit=crop&w=1200&q=80';

function App() {
  const [seccion, setSeccion] = useState('inicio');

  const renderContenido = () => {
    switch (seccion) {
      case 'productos':
        const [productos, setProductos] = React.useState([]);
        const [loadingProductos, setLoadingProductos] = React.useState(true);
        const [errorProductos, setErrorProductos] = React.useState('');
        const [showFormProd, setShowFormProd] = React.useState(false);
        const [formProd, setFormProd] = React.useState({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' });
        const [enviadoProd, setEnviadoProd] = React.useState(false);
        const [errorFormProd, setErrorFormProd] = React.useState('');

        React.useEffect(() => {
          setLoadingProductos(true);
          fetch('http://localhost:5000/productos')
            .then(res => res.json())
            .then(data => {
              setProductos(data);
              setLoadingProductos(false);
            })
            .catch(() => {
              setErrorProductos('No se pudo cargar los productos');
              setLoadingProductos(false);
            });
        }, [enviadoProd]);

        const handleChangeProd = e => {
          setFormProd({ ...formProd, [e.target.name]: e.target.value });
        };

        const handleSubmitProd = async e => {
          e.preventDefault();
          setErrorFormProd('');
          setEnviadoProd(false);
          try {
            const res = await fetch('http://localhost:5000/productos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...formProd, precio: Number(formProd.precio), stock: Number(formProd.stock) })
            });
            if (res.ok) {
              setEnviadoProd(true);
              setShowFormProd(false);
              setFormProd({ nombre: '', descripcion: '', precio: '', stock: '', imagen: '' });
            } else {
              const data = await res.json();
              setErrorFormProd(data.error || 'Error al agregar producto');
            }
          } catch {
            setErrorFormProd('No se pudo conectar con el servidor');
          }
        };

        return (
          <div className="py-20 px-4">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Productos</h2>
            <button className="mb-6 px-6 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition w-full max-w-2xl mx-auto" onClick={()=>setShowFormProd(true)}>Agregar nuevo producto</button>
            {showFormProd && (
              <form className="flex flex-col space-y-3 bg-white p-4 rounded shadow max-w-2xl mx-auto mb-8" onSubmit={handleSubmitProd}>
                <input name="nombre" type="text" placeholder="Nombre" value={formProd.nombre} onChange={handleChangeProd} className="px-4 py-2 rounded border focus:outline-none" required />
                <input name="descripcion" type="text" placeholder="Descripción" value={formProd.descripcion} onChange={handleChangeProd} className="px-4 py-2 rounded border focus:outline-none" required />
                <input name="precio" type="number" placeholder="Precio" value={formProd.precio} onChange={handleChangeProd} className="px-4 py-2 rounded border focus:outline-none" required />
                <input name="stock" type="number" placeholder="Stock" value={formProd.stock} onChange={handleChangeProd} className="px-4 py-2 rounded border focus:outline-none" required />
                <input name="imagen" type="text" placeholder="URL de imagen (opcional)" value={formProd.imagen} onChange={handleChangeProd} className="px-4 py-2 rounded border focus:outline-none" />
                {errorFormProd && <div className="text-red-500 text-center">{errorFormProd}</div>}
                <button type="submit" className="px-6 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition">Guardar producto</button>
                <button type="button" className="px-6 py-2 bg-gray-300 text-black rounded font-bold hover:bg-gray-400 transition mt-2" onClick={()=>setShowFormProd(false)}>Cancelar</button>
              </form>
            )}
            {enviadoProd && <div className="text-green-600 font-bold text-center mb-4">¡Producto agregado correctamente!</div>}
            {loadingProductos ? (
              <div className="text-white text-center">Cargando productos...</div>
            ) : errorProductos ? (
              <div className="text-red-500 text-center">{errorProductos}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {productos.length === 0 ? (
                  <div className="col-span-3 text-center text-gray-300">No hay productos disponibles.</div>
                ) : productos.map(producto => (
                  <div key={producto._id} className="bg-white bg-opacity-90 rounded-xl shadow-lg p-6 flex flex-col items-center">
                    <img src={producto.imagen || 'https://cdn-icons-png.flaticon.com/512/2965/2965358.png'} alt={producto.nombre} className="w-24 h-24 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                    <p className="text-gray-600 mb-2">{producto.descripcion}</p>
                    <span className="text-yellow-600 font-bold text-lg mb-2">${producto.precio}</span>
                    <span className="text-gray-500 mb-2">Stock: {producto.stock}</span>
                    <button className="mt-2 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition">Agregar al pedido</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'pedidos':
        const [pedidos, setPedidos] = React.useState([]);
        const [loadingPedidos, setLoadingPedidos] = React.useState(true);
        const [errorPedidos, setErrorPedidos] = React.useState('');
        const [showFormPedido, setShowFormPedido] = React.useState(false);
        const [clientesPedido, setClientesPedido] = React.useState([]);
        const [productosPedido, setProductosPedido] = React.useState([]);
        const [formPedido, setFormPedido] = React.useState({ cliente: '', productos: [], total: 0 });
        const [enviadoPedido, setEnviadoPedido] = React.useState(false);
        const [errorFormPedido, setErrorFormPedido] = React.useState('');

        React.useEffect(() => {
          setLoadingPedidos(true);
          fetch('http://localhost:5000/pedidos')
            .then(res => res.json())
            .then(data => {
              setPedidos(data);
              setLoadingPedidos(false);
            })
            .catch(() => {
              setErrorPedidos('No se pudo cargar los pedidos');
              setLoadingPedidos(false);
            });
        }, [enviadoPedido]);

        React.useEffect(() => {
          fetch('http://localhost:5000/clientes')
            .then(res => res.json())
            .then(data => setClientesPedido(data));
          fetch('http://localhost:5000/productos')
            .then(res => res.json())
            .then(data => setProductosPedido(data));
        }, [showFormPedido]);

        const handleChangePedido = e => {
          setFormPedido({ ...formPedido, [e.target.name]: e.target.value });
        };

        const handleSelectProducto = e => {
          const value = Array.from(e.target.selectedOptions, option => option.value);
          setFormPedido({ ...formPedido, productos: value });
        };

        const calcularTotal = () => {
          return formPedido.productos.reduce((acc, prodId) => {
            const prod = productosPedido.find(p => p._id === prodId);
            return acc + (prod ? prod.precio : 0);
          }, 0);
        };

        const handleSubmitPedido = async e => {
          e.preventDefault();
          setErrorFormPedido('');
          setEnviadoPedido(false);
          const total = calcularTotal();
          try {
            const res = await fetch('http://localhost:5000/pedidos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cliente: formPedido.cliente, productos: formPedido.productos, total })
            });
            if (res.ok) {
              setEnviadoPedido(true);
              setShowFormPedido(false);
              setFormPedido({ cliente: '', productos: [], total: 0 });
            } else {
              const data = await res.json();
              setErrorFormPedido(data.error || 'Error al agregar pedido');
            }
          } catch {
            setErrorFormPedido('No se pudo conectar con el servidor');
          }
        };

        return (
          <div className="py-20 px-4">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Pedidos</h2>
            <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
              {loadingPedidos ? (
                <div className="text-center text-gray-700">Cargando pedidos...</div>
              ) : errorPedidos ? (
                <div className="text-center text-red-500">{errorPedidos}</div>
              ) : (
                <table className="w-full text-left mb-6">
                  <thead>
                    <tr className="text-gray-700 border-b">
                      <th className="py-2">Cliente</th>
                      <th className="py-2">Productos</th>
                      <th className="py-2">Total</th>
                      <th className="py-2">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidos.length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-gray-400 py-4">No hay pedidos disponibles.</td></tr>
                    ) : pedidos.map(pedido => (
                      <tr key={pedido._id} className="border-b">
                        <td className="py-2">{pedido.cliente?.nombre || 'Sin nombre'}</td>
                        <td className="py-2">{Array.isArray(pedido.productos) ? pedido.productos.join(', ') : pedido.productos}</td>
                        <td className="py-2 text-yellow-600 font-bold">${pedido.total}</td>
                        <td className="py-2">{pedido.fecha ? pedido.fecha.substring(0,10) : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button className="mb-4 px-6 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition w-full" onClick={()=>setShowFormPedido(true)}>Crear nuevo pedido</button>
              {showFormPedido && (
                <form className="flex flex-col space-y-3 bg-white p-4 rounded shadow" onSubmit={handleSubmitPedido}>
                  <select name="cliente" value={formPedido.cliente} onChange={handleChangePedido} className="px-4 py-2 rounded border focus:outline-none" required>
                    <option value="">Selecciona cliente</option>
                    {clientesPedido.map(cliente => (
                      <option key={cliente._id} value={cliente._id}>{cliente.nombre}</option>
                    ))}
                  </select>
                  <select name="productos" multiple value={formPedido.productos} onChange={handleSelectProducto} className="px-4 py-2 rounded border focus:outline-none" required>
                    {productosPedido.map(producto => (
                      <option key={producto._id} value={producto._id}>{producto.nombre} (${producto.precio})</option>
                    ))}
                  </select>
                  <div className="text-gray-700">Total: <span className="font-bold text-yellow-600">${calcularTotal()}</span></div>
                  {errorFormPedido && <div className="text-red-500 text-center">{errorFormPedido}</div>}
                  <button type="submit" className="px-6 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition">Guardar pedido</button>
                  <button type="button" className="px-6 py-2 bg-gray-300 text-black rounded font-bold hover:bg-gray-400 transition mt-2" onClick={()=>setShowFormPedido(false)}>Cancelar</button>
                </form>
              )}
              {enviadoPedido && <div className="text-green-600 font-bold text-center mt-4">¡Pedido agregado correctamente!</div>}
            </div>
          </div>
        );
      case 'clientes':
        const [clientes, setClientes] = React.useState([]);
        const [loadingClientes, setLoadingClientes] = React.useState(true);
        const [errorClientes, setErrorClientes] = React.useState('');
        const [showForm, setShowForm] = React.useState(false);
        const [formCliente, setFormCliente] = React.useState({ nombre: '', email: '', telefono: '', direccion: '' });
        const [enviadoCliente, setEnviadoCliente] = React.useState(false);
        const [errorFormCliente, setErrorFormCliente] = React.useState('');

        React.useEffect(() => {
          setLoadingClientes(true);
          fetch('http://localhost:5000/clientes')
            .then(res => res.json())
            .then(data => {
              setClientes(data);
              setLoadingClientes(false);
            })
            .catch(() => {
              setErrorClientes('No se pudo cargar los clientes');
              setLoadingClientes(false);
            });
        }, [enviadoCliente]);

        const handleChangeCliente = e => {
          setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
        };

        const handleSubmitCliente = async e => {
          e.preventDefault();
          setErrorFormCliente('');
          setEnviadoCliente(false);
          try {
            const res = await fetch('http://localhost:5000/clientes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formCliente)
            });
            if (res.ok) {
              setEnviadoCliente(true);
              setShowForm(false);
              setFormCliente({ nombre: '', email: '', telefono: '', direccion: '' });
            } else {
              const data = await res.json();
              setErrorFormCliente(data.error || 'Error al agregar cliente');
            }
          } catch {
            setErrorFormCliente('No se pudo conectar con el servidor');
          }
        };

        return (
          <div className="py-20 px-4">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Clientes</h2>
            <div className="max-w-3xl mx-auto bg-white bg-opacity-90 rounded-xl shadow-lg p-6">
              {loadingClientes ? (
                <div className="text-center text-gray-700">Cargando clientes...</div>
              ) : errorClientes ? (
                <div className="text-center text-red-500">{errorClientes}</div>
              ) : (
                <table className="w-full text-left mb-6">
                  <thead>
                    <tr className="text-gray-700 border-b">
                      <th className="py-2">Nombre</th>
                      <th className="py-2">Email</th>
                      <th className="py-2">Teléfono</th>
                      <th className="py-2">Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientes.length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-gray-400 py-4">No hay clientes disponibles.</td></tr>
                    ) : clientes.map(cliente => (
                      <tr key={cliente._id} className="border-b">
                        <td className="py-2">{cliente.nombre}</td>
                        <td className="py-2">{cliente.email}</td>
                        <td className="py-2">{cliente.telefono}</td>
                        <td className="py-2">{cliente.direccion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <button className="mb-4 px-6 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition w-full" onClick={()=>setShowForm(true)}>Agregar nuevo cliente</button>
              {showForm && (
                <form className="flex flex-col space-y-3 bg-white p-4 rounded shadow" onSubmit={handleSubmitCliente}>
                  <input name="nombre" type="text" placeholder="Nombre" value={formCliente.nombre} onChange={handleChangeCliente} className="px-4 py-2 rounded border focus:outline-none" required />
                  <input name="email" type="email" placeholder="Email" value={formCliente.email} onChange={handleChangeCliente} className="px-4 py-2 rounded border focus:outline-none" required />
                  <input name="telefono" type="text" placeholder="Teléfono" value={formCliente.telefono} onChange={handleChangeCliente} className="px-4 py-2 rounded border focus:outline-none" required />
                  <input name="direccion" type="text" placeholder="Dirección" value={formCliente.direccion} onChange={handleChangeCliente} className="px-4 py-2 rounded border focus:outline-none" required />
                  {errorFormCliente && <div className="text-red-500 text-center">{errorFormCliente}</div>}
                  <button type="submit" className="px-6 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition">Guardar cliente</button>
                  <button type="button" className="px-6 py-2 bg-gray-300 text-black rounded font-bold hover:bg-gray-400 transition mt-2" onClick={()=>setShowForm(false)}>Cancelar</button>
                </form>
              )}
              {enviadoCliente && <div className="text-green-600 font-bold text-center mt-4">¡Cliente agregado correctamente!</div>}
            </div>
          </div>
        );
      case 'contacto':
        const [form, setForm] = React.useState({ nombre: '', email: '', mensaje: '' });
        const [enviado, setEnviado] = React.useState(false);
        const [error, setError] = React.useState('');

        const handleChange = e => {
          setForm({ ...form, [e.target.name]: e.target.value });
        };

        const handleSubmit = async e => {
          e.preventDefault();
          setError('');
          setEnviado(false);
          try {
            const res = await fetch('http://localhost:5000/contacto', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) setEnviado(true);
            else setError(data.error || 'Error al enviar');
          } catch {
            setError('No se pudo conectar con el servidor');
          }
        };

        return (
          <div className="py-20 px-4 flex flex-col items-center">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Contacto</h2>
            <div className="max-w-md w-full bg-white bg-opacity-90 rounded-xl shadow-lg p-8">
              {enviado ? (
                <div className="text-green-600 font-bold text-center mb-4">¡Mensaje enviado correctamente!</div>
              ) : null}
              {error ? (
                <div className="text-red-600 font-bold text-center mb-4">{error}</div>
              ) : null}
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                <input name="nombre" type="text" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="px-4 py-2 rounded border focus:outline-none" required />
                <input name="email" type="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="px-4 py-2 rounded border focus:outline-none" required />
                <textarea name="mensaje" placeholder="Mensaje" rows="4" value={form.mensaje} onChange={handleChange} className="px-4 py-2 rounded border focus:outline-none" required />
                <button type="submit" className="px-6 py-2 bg-yellow-400 text-black rounded font-bold hover:bg-yellow-500 transition">Enviar mensaje</button>
              </form>
            </div>
          </div>
        );
      default:
        return (
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-5xl px-8 py-20">
            <div className="md:w-1/2 text-white">
              <h2 className="text-lg tracking-widest mb-2 text-yellow-400">CALIDAD Y SERVICIO</h2>
              <h1 className="text-6xl font-extrabold mb-6">FERRETERÍA ROCMA</h1>
              <p className="text-lg mb-8 max-w-md">Todo lo que necesitas para tu proyecto, obra o reparación. Herramientas, materiales y atención personalizada para clientes y empresas.</p>
              <div className="flex space-x-4 mb-8">
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 rounded-full hover:bg-yellow-400 transition"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 rounded-full hover:bg-yellow-400 transition"><i className="fab fa-instagram"></i></a>
                <a href="#" className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 rounded-full hover:bg-yellow-400 transition"><i className="fab fa-whatsapp"></i></a>
              </div>
              <button className="px-8 py-3 bg-yellow-400 text-black font-bold rounded shadow hover:bg-yellow-500 transition" onClick={() => setSeccion('productos')}>Ver productos</button>
            </div>
            <div className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0">
              <div className="w-80 h-80 bg-white bg-opacity-10 rounded-3xl flex items-center justify-center shadow-lg">
                <span className="text-7xl text-yellow-400 font-extrabold animate-float">🛠️</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center" style={{backgroundImage: `url(${bgFerreteria})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <nav className="absolute top-0 left-0 w-full flex justify-between items-center px-10 py-6 z-10">
        <div className="text-white text-2xl font-bold tracking-widest">ROCMA</div>
        <ul className="flex space-x-8 text-white font-semibold">
          <li className={`hover:text-yellow-400 cursor-pointer ${seccion==='inicio'?'underline':''}`} onClick={()=>setSeccion('inicio')}>Inicio</li>
          <li className={`hover:text-yellow-400 cursor-pointer ${seccion==='productos'?'underline':''}`} onClick={()=>setSeccion('productos')}>Productos</li>
          <li className={`hover:text-yellow-400 cursor-pointer ${seccion==='pedidos'?'underline':''}`} onClick={()=>setSeccion('pedidos')}>Pedidos</li>
          <li className={`hover:text-yellow-400 cursor-pointer ${seccion==='clientes'?'underline':''}`} onClick={()=>setSeccion('clientes')}>Clientes</li>
          <li className={`hover:text-yellow-400 cursor-pointer ${seccion==='contacto'?'underline':''}`} onClick={()=>setSeccion('contacto')}>Contacto</li>
        </ul>
      </nav>
      <div className="w-full">
        {renderContenido()}
      </div>
      <Chatbot />
      <footer className="absolute bottom-0 left-0 w-full text-center text-white py-4 z-10">
        <span className="opacity-70">© 2025 ROCMA Ferretería. Todos los derechos reservados.</span>
      </footer>
    </div>
  );
}

export default App;
