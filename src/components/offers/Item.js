import React from 'react';
import altImage from '../../images/product-image_241w.png';

const Item = ({ toggle, offer, imageName }) => {
    return(
        <div className="promo slide promo--product slick-slide slick-current slick-active" aria-hidden="false">
            <div onClick={()=>toggle(offer)} className="promo__inner slide__inner">
                <div className="promo__img">
                    <img src={`https://s3.wasabisys.com/hugo-images/flat/${imageName}`} onError={(e)=>{e.target.onerror = null; e.target.src=altImage}} alt={offer.AltText} className="img-fluid d-block" />
                </div>

                <div className="promo__text--wrap">
                    <h5 className="promo__title">
                        <span className="promo__overline">{offer.Overline1Web}</span>
                        <span className="promo__mainline">{offer.Mainline1Web}</span>
                    </h5>
                    <div className="promo__price--wrap">
                    <span className="promo__price">{offer.Price}</span>
                    </div>      
                </div>
                
                <button type="button" className="btn btn-primary btn-plus fg-white">
                    <i className="fas fa-plus"></i>
                </button>
                {offer.Bug === "New" ? <div className="promo__bug">{offer.Bug}</div> : <div></div>} 
            </div>
        </div>
    )
}
    

export default Item;