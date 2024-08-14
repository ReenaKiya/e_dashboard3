import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, [])

  const getProducts = async (req, res) => {
    let result = await fetch('http://localhost:4200/product-list', {
      headers: {
        Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    })
    result = await result.json()
    setProducts(result)
  }

  const deleteProduct = async (id) => {

    let result = await fetch(`http://localhost:4200/product/${id}`, {
      method: "Delete",
      headers: {
        Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
      }
    });
    result = await result.json()
    if (result) {
      // alert("Product is deleted")
      getProducts();
    }
  }
  const seacrchHandle = async (event) => {
    console.log(event.target.value)
    let key = event.target.value;
    if (key) {
      let result = await fetch(`http://localhost:4200/search/${key}`, {
        headers: {
          Authorization: `bearer ${JSON.parse(localStorage.getItem('token'))}`
        }
      });
      result = await result.json()
      if (result) {
        setProducts(result)
      }
    } else {
      getProducts();
    }


  }
  return (
    <div className='product-list'>
      <h3>Product List</h3>
      <input className='search-box ' type="text" placeholder='Search product' onChange={seacrchHandle} />
      <ul>
        <li>S.No</li>
        <li>Name</li>
        <li>Price</li>
        <li>category</li>
        <li>Operation</li>
      </ul>
      {
        products.length > 0 ? products.map((item, index) =>
          <ul key={item._id}>
            <li>{index + 1}</li>
            <li>{item.name}</li>
            <li>${item.price}</li>
            <li>{item.category}</li>
            <li>
              <button onClick={() => deleteProduct(item._id)}>Delete</button>
              <Link to={'/update/' + item._id}>Update</Link></li>
          </ul>
        )
          : <h1>No Result Found</h1>
      }
    </div>
  )
}

export default ProductList
