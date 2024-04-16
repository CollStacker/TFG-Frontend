<template>
  <div class="padding">
    <div class="col-md-8">
      <!-- Column -->
      <div class="card"> 
        <img class="card-img-top" src="https://i.imgur.com/K7A78We.jpg" alt="Card image cap">
        <div class="card-body little-profile text-center">
          <div class="pro-img"><img src="https://i.imgur.com/8RKXAIV.jpg" alt="user"></div>
          <h3 class="m-b-0">Brad Macullam</h3>
          <div class="row text-center m-t-20">
            <div class="col-lg-4 col-md-4 m-t-20">
              <h3 class="m-b-0 font-light">10434</h3><small>Articles</small>
            </div>
            <div class="col-lg-4 col-md-4 m-t-20">
              <h3 class="m-b-0 font-light">434K</h3><small>Followers</small>
            </div>
            <div class="col-lg-4 col-md-4 m-t-20">
              <h3 class="m-b-0 font-light">5454</h3><small>Following</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
  body {
    background-color: #000000;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }

  .padding {
    padding: 3rem;
    margin-left: 200px;
  }

  .card {
    border-radius: 4px;
    background-color: #ffffff;
    margin-bottom: 30px;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
  }

  .card-img-top {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
  }

  .card-body {
    padding: 1.25rem;
  }

  .little-profile .pro-img img {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }

  .text-center {
    text-align: center;
  }

  .m-b-0 {
    margin-bottom: 0;
  }

  .m-t-20 {
    margin-top: 20px;
  }

  .col-md-4 {
    flex: 0 0 auto;
    width: 33.333333%;
  }

  .col-md-8 {
    flex: 0 0 auto;
    width: 66.666667%;
  }

  @media (max-width: 991.98px) {
    .padding {
      margin-left: 0;
    }
  }
</style>