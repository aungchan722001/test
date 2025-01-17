//Modal popup when click on signup//
function showModal(){
    document.getElementById("signupModal").style.display = "block";
}

function closeModal(){
    document.getElementById("signupModal").style.display = "none";
}

window.onclick = function (event){
    const modal = document.getElementById("signupModal");
    if (event.target === modal) 
    {
        modal.style.display = "none";
    }
}

//Search bar//
document.addEventListener('DOMContentLoaded', ()=> {
    const coffeeSearch = document.getElementById('searchbar');
    if (coffeeSearch) {
        const coffeeItems = document.querySelectorAll('#coffee-list .coffee-item');
        coffeeSearch.addEventListener('input', (e)=> {
            const searchValue = e.target.value.toLowerCase();
            coffeeItems.forEach((item) => {
                const itemName = item.querySelector('h2').textContent.toLowerCase();
                item.style.display = itemName.includes(searchValue) ? 'block' : 'none';
            });
        });
    }
    const equipmentSearch = document.getElementById('searchEquipment');
    if (equipmentSearch) {
        const equipmentItems = document.querySelectorAll('#brew-container .equipment-item');
        equipmentSearch.addEventListener('input', (e)=> {
            const searchValue = e.target.value.toLowerCase();
            equipmentItems.forEach((item) => {
                const itemName = item.querySelector('h2').textContent.toLowerCase();
                item.style.display = itemName.includes(searchValue) ? 'block' : 'none';
            });
        });
    }
});

//EventsWorkshops//
function registerForEvent(eventName){
    document.getElementById('eventName').value = eventName;
    document.getElementById('eventModal').style.display = 'block';
}
function closeEventModal(){
    document.getElementById('eventModal').style.display = 'none';
}
window.onclick = function(event){
    const modal = document.getElementById('eventModal');
    if (event.target === modal)
    {
        closeEventModal();
    }
};

//Add to basket//
let addtobasket = (btn) => {
    let parentItem = btn.parentNode;
    let name = parentItem.querySelector('h2').innerText.trim();
    let priceText = parentItem.querySelector('.coffee-price, .equip-price').innerText.trim();
    let priceMatch = priceText.match(/£\d+(\.\d{2})?/); // Match £ followed by digits
    let price = priceMatch ? parseFloat(priceMatch[0].replace('£', '')) : 0;

    let item = {
        name: name,
        price: price,
        quantity: 1 
    };
    if (sessionStorage.getItem("basket") === null) 
    {
        let basket = [item];
        sessionStorage.setItem("basket", JSON.stringify(basket));
    } 
    else 
    {
        let basket = JSON.parse(sessionStorage.getItem("basket"));

        let existingItem = basket.find((i) => i.name === name);
        if (existingItem) 
        {
            existingItem.quantity += 1;
        } 
        else 
        {
            basket.push(item);
        }
        sessionStorage.setItem("basket", JSON.stringify(basket));
    }

//To Update the cart notification//
    let basket = JSON.parse(sessionStorage.getItem("basket"));
    let badge = document.getElementById('inputnum');
    if (badge) {
        badge.innerText = basket.reduce((total, item) => total + item.quantity, 0);
    }
    console.log("Item added to basket:", item);
    console.log("Current basket:", basket);
};

// Show items in the cart //
let show = () => {
    if (sessionStorage.getItem("basket") != null) 
    {
        let basket = JSON.parse(sessionStorage.getItem("basket"));
        let cartBody = "";
        let total = 0;
        basket.forEach((item, index) => {
            if (!item.quantity || isNaN(item.quantity)) 
            {
                item.quantity = 1;
            }

            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartBody += '<tr>' +
                '<td>' + (index + 1) + '</td>' +
                '<td>' + item.name + '</td>' +
                '<td>£' + item.price.toFixed(2) + '</td>' +
                '<td>' +
                    '<button onclick="updateQuantity(' + index + ', -1)" class="btn btn-sm btn-secondary">-</button>' +
                    item.quantity +
                    '<button onclick="updateQuantity(' + index + ', 1)" class="btn btn-sm btn-secondary">+</button>' +
                '</td>' +
                '<td>£' + itemTotal.toFixed(2) + '</td>' +
                '<td><button onclick="removeItem(' + index + ')" class="btn btn-sm btn-danger">Remove</button></td>' +
            '</tr>';
        });
        cartBody += '<tr>' +
            '<td colspan="4"><strong>Total</strong></td>' +
            '<td><strong>£' + total.toFixed(2) + '</strong></td>' +
            '<td></td>' +
        '</tr>';
        document.getElementById("cart").innerHTML = cartBody;
    } 
    else 
    {
        document.getElementById("cart").innerHTML = "<tr><td colspan='6'>Your cart is empty.</td></tr>";
    }
};

//Update the quantity of item//
let updateQuantity = (index, change) => {
    let basket = JSON.parse(sessionStorage.getItem("basket"));
    basket[index].quantity += change;

    if (basket[index].quantity < 1) 
    {
        basket[index].quantity = 1;
    }
    sessionStorage.setItem("basket", JSON.stringify(basket));
    show();
};
let removeItem = (index) => {
    let basket = JSON.parse(sessionStorage.getItem("basket"));
    basket.splice(index, 1);

    sessionStorage.setItem("basket", JSON.stringify(basket));
    show();
};

    document.addEventListener("DOMContentLoaded", function(){
        if (typeof lightbox !== "undefined") {
            lightbox.init();
        }
    });

//Coffee selection zoom img//
$(document).ready(function() {
    $(".zoom").zoom({
        magnify: 1.1,
    });
});

//Brewing equips sort_by & filter_by//
$(document).ready(function() {
//To sort equipment items//
    function sortEquipment(sortBy) {
        const $container = $("#brew-container");
        const $items = $container.find(".equipment-item").get();

        $items.sort(function(a, b) {
            const nameA = $(a).find("h2").text().toLowerCase();
            const nameB = $(b).find("h2").text().toLowerCase();

            if (sortBy === "name-asc") {
                return nameA.localeCompare(nameB); //Sort by name (A-Z)
            } else if (sortBy === "name-desc") {
                return nameB.localeCompare(nameA); //Sort by name (Z-A)
            } 
        });

        $container.empty().append($items); 
    }
//To filter equipment items//
    function filterEquipment(filterBy) {
        const $items = $("#brew-container .equipment-item");
        $items.each(function() {
            const category = $(this).data("category");
            if (filterBy === "all" || category === filterBy) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    $("#sort-by").change(function() {
        const sortBy = $(this).val();
        sortEquipment(sortBy);
    });

    $("#filter-by").change(function() {
        const filterBy = $(this).val();
        filterEquipment(filterBy);
    });

    sortEquipment("name-asc");
    filterEquipment("all");
});

//Magnific popup//
$(document).ready(function(){
    $('.popup-link').magnificPopup({
        type: 'inline',
        midClick: true,
        closeBtnInside: true,
        fixedContentPos: true,
    });
});
