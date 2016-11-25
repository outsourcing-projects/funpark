/*! 
* FUNP - v1.0.0 
* © Copyright 2016  Liangli Huang
 */
/**
 * Created by hualiang on 16-10-19.
 */

/**
 * Created by hualiang on 16-10-23.
 */
$(function() {
    var apiPath = "http://118.178.124.197:8080/";
    var app = angular.module("app", ["ngRoute"]);
    app.config(function($routeProvider) {
        $routeProvider
            .when("/primary_product", {
                templateUrl : "app/views/product/primary_product.html",
                controller : "primaryProductCtrl"
            })
            .when("/product_list", {
                templateUrl : "app/views/product/product_list.html",
                controller : "productListCtrl"
            })
            .when("/new_ar_product_detail/:productID", {
                templateUrl : "app/views/product/new_ar_product_detail.html",
                controller : "updateARProductDetail"
            })
            .when("/new_ar_product_detail", {
                templateUrl : "app/views/product/new_ar_product_detail.html",
                controller : "newARDetailCtrl"
            })
            .when("/new_video_product_detail", {
                templateUrl : "app/views/product/new_video_product_detail.html",
                controller : "newVideoDetailCtrl"
            })
            .when("/first_level_category", {
                templateUrl : "app/views/category/first_level_category.html",
                controller : "firstLevelCategoryCtrl"
            })
            .when("/second_level_category", {
                templateUrl : "app/views/category/second_level_category.html",
                controller : "secondLevelCategoryCtrl"
            })
            .when("/user_admin", {
                templateUrl : "app/views/user/user_admin.html",
                controller : "userAdminCtrl"
            })
            .when("/log_download", {
                templateUrl : "app/views/log/log_download.html",
                controller : "logDownloadCtrl"
            })
            .otherwise("/primary_product",{
                templateUrl : "app/views/product/primary_product.html",
                controller : "otherUrlCtrl"
            });
    });
    app.controller("primaryProductCtrl", function () {
        console.log("Arrived at primary product page already!!");
    });
    app.controller("productListCtrl", function ($scope, $http){
        $scope.productItems = null;
        $scope.productItems_selected = [];
        $scope.actionSelected = "";
        $scope.productItems_copy = [];

        //wait for loading product list
        loading();

        //Get product list data
        getProductListByFilters = function(){
            var searchProductByFilters = {};
            searchProductByFilters.type = $("#product_type").prop('selectedIndex');
            searchProductByFilters.publishState = $("#release_state").prop('selectedIndex');
            searchProductByFilters.productRecommend = $("#recommendation").prop('selectedIndex');
            searchProductByFilters.productCategory = $("#product_category").val();

            $http.post(apiPath + "eden/prods/lists", searchProductByFilters)
                .then(function successCallback(response) {
                    console.log("Get product list by filter successfully.");
                    $scope.productItems = response.data;
                    $scope.productItems_copy = response.data;
                    $scope.productItems_selected = [];
                }, function errorCallback(response) {
                    console.log("Failed to get product list by filter");
                });
        };
        console.log("Invoke product list controller, get product list data from remote here!");
        $scope.searchProductListByFilters = function (){
            console.log("Starting to search product items by filters...");
            console.log("Selected product category: " + $("#product_category").val() + " Selected index: " + $("#product_category").prop('selectedIndex'));
            console.log("Selected product type: " + $("#product_type").val() + " Selected index: " + $("#product_type").prop('selectedIndex'));
            console.log("Selected release state: " + $("#release_state").val() + " Selected index: " + $("#release_state").prop('selectedIndex'));
            console.log("Selected recommendation: " + $("#recommendation").val() + " Selected index: " + $("#recommendation").prop('selectedIndex'));

            getProductListByFilters();
        };
        $scope.searchProductListByFilters();

        //click top check item - all yes or no
        $scope.checkALLYesNo = function (){
            console.log("Check all flag: " + $scope.checkAll);
            var allCheck = $('input[name=mySelectedProduct]');
            allCheck.prop('checked', $scope.checkAll);
            $scope.productItems_selected = [];
            if($scope.checkAll){
                for(item in $scope.productItems_copy){
                    $scope.productItems_selected.push($scope.productItems_copy[item]);
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);
        };

        //click check item for each line and update top check status if need
        $scope.checkItem = function(userItem){
            console.log("Check item flag: " + userItem.checked);
            if (userItem.checked){
                $scope.productItems_selected.push(userItem);
            }else{
                for(item in $scope.productItems_selected){
                    if($scope.productItems_selected[item].id == userItem.id){
                        $scope.productItems_selected.splice(item, 1);
                    }
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);
            var allCheck = $("#allCheckControl");
            if($scope.productItems_selected.length == 0){
                allCheck.prop('checked', false);
            }else if($scope.productItems_selected.length == $scope.productItems_copy.length){
                allCheck.prop('checked', true);
            }
        };

        //reset productItem with copy list
        $scope.resetSearch = function (){
            $scope.productItems = $scope.productItems_copy;
            $scope.searchProductListByFilters();
        };

        //open modal for recommend/recommendCancel/online/offline
        $scope.actionClickModal = function (action){
            console.log("Click button: "+action);
            $scope.actionSelected = action;
        };

        //confirm yes or no in modal dialog
        $scope.actionConfirm = function (){
            console.log("Confirm action: "+$scope.actionSelected);

            angular.forEach($scope.productItems_selected, function(item){
                $http.get(apiPath + "eden/prods/opes/" + $scope.actionSelected + "/" + item.id)
                    .then(function successCallback(response) {
                        console.log($scope.actionSelected + " product: " + item.name + " successfully");
                        getProductListByFilters();
                    }, function errorCallback(response) {
                        console.log("Failed to " + $scope.actionSelected + " product: " + item.name);
                    });
            });

            $(confirmDiag).modal('hide');
        };
    });
    app.controller("updateARProductDetail", function ($routeParams) {
        console.log("Product ID: "+ $routeParams.productID);
    });
    app.controller("newARDetailCtrl", function () {
        console.log("Arrived at new AR product detail page already!!");
    });
    app.controller("newVideoDetailCtrl", function () {
        console.log("Arrived at new video product detail page already!!");
    });
    app.controller("firstLevelCategoryCtrl", function ($scope,$http){

        $scope.firstLevelCategoryItems = null;
        loading();

        //Get first level category list data
        $http.get(apiPath + "eden/cates/list/levelone")
            .then(function successCallback(response) {
                $scope.firstLevelCategoryItems = response.data;
            }, function errorCallback(response) {
                console.log("Failed to get the first level category");
            });

        //filter category list by category name
        $scope.searchByCategory = function (){
            if(null === $scope.firstLevelCategoryItems){
                console.log("The first level category is empty");
                return;
            }

            firstLevelCategoryItems_temp = $scope.firstLevelCategoryItems;
            $scope.firstLevelCategoryItems = [];
            var pattern = new RegExp($scope.firstCategorySearch, "i");
            for(item in firstLevelCategoryItems_temp){
                if(pattern.test(firstLevelCategoryItems_temp[item].categoryName)) {
                    $scope.firstLevelCategoryItems.push(firstLevelCategoryItems_temp[item]);
                }
            }
        };

        //get selected category item for deleting
        $scope.deleteItem = function(selectedItem) {
            $scope.selectedFirstLevelCategoryID = selectedItem.id;
            $scope.selectedFirstLevelCategoryItem = selectedItem;
        };
        //delete level one category item
        $scope.deleteFirstCategory = function(){
            $http.get(apiPath + "eden/cates/delete/" + $scope.selectedFirstLevelCategoryID)
                .then(function successCallback(response) {
                    console.log("Success to delete the first level category ID: " + $scope.selectedFirstLevelCategoryID);
                    $http.get(apiPath + "eden/cates/list/levelone")
                        .then(function successCallback(response) {
                            $(deleteFirstCategoryModal).modal('hide');
                            $scope.firstLevelCategoryItems = response.data;
                        }, function errorCallback(response) {
                            console.log("Failed to get the first level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to get the first level category");
                });
        };

        //get selected category item for updating
        $scope.updateItem = function(selectedItem) {
            $scope.currentUpdateItem = selectedItem;
            $scope.levelOneCategoryName = selectedItem.categoryName;
        };
        //update level one category
        $scope.updateFirstCategory = function(){
            console.log("Update the first level category: "+$scope.levelOneCategoryName);

            $scope.currentUpdateItem.categoryName = $scope.levelOneCategoryName;
            $http.post(apiPath + "eden/cates/update", $scope.currentUpdateItem)
                .then(function successCallback(response) {
                    console.log("Update first category item successfully.");
                    $(updateFirstCategoryModal).modal('hide');

                    $http.get(apiPath + "eden/cates/list/levelone")
                        .then(function successCallback(response) {
                            $scope.firstLevelCategoryItems = response.data;
                        }, function errorCallback(response) {
                            console.log("Failed to get the first level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to update first category item ");
                });
        };

        //check update modal dialog fields
        $scope.fieldCheck = function(){
            if(typeof $scope.levelOneCategoryName === "undefined"){
                $scope.updateFormInvalid = true;
            }else{
                $scope.updateFormInvalid = false;
            }
        };

        //create level one category
        $scope.createFirstCategory = function(){
            var newFirstCategory = {};
            newFirstCategory.categoryName = $scope.newFirstCategoryName;
            newFirstCategory.categoryUpdateDate = new Date();
            newFirstCategory.categoryLevel = 1;
            newFirstCategory.categoryPrevious = 0;
            newFirstCategory.categoryDeleted = 0;

            $http.post(apiPath + "eden/cates/add", newFirstCategory)
                .then(function successCallback(response) {
                    console.log("Create first category item successfully.");
                    $(newFirstCategoryModal).modal('hide');

                    $http.get(apiPath + "eden/cates/list/levelone")
                        .then(function successCallback(response) {
                            $scope.firstLevelCategoryItems = response.data;
                        }, function errorCallback(response) {
                            console.log("Failed to get the first level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to create first category item ");
                });

            $scope.newFirstCategoryName = "";
        };
    });
    app.controller("secondLevelCategoryCtrl", function ($scope, $http){
        $scope.levelTwoCategoryItems = null;
        $scope.levelOneCategoryItems = null;
        $scope.firstCategorySelected = null;
        loading();

        //Get first level category list data
        $http.get(apiPath + "eden/cates/list/levelone")
            .then(function successCallback(response) {
                $scope.levelOneCategoryItems = response.data;

                if (response.data.length > 0){
                    $scope.levelOneCategorySelected = response.data[0];

                    //get level two category
                    $http.get(apiPath + "eden/cates/list/leveltwo/" + $scope.levelOneCategorySelected.id)
                        .then(function successCallback(response) {
                            $scope.levelTwoCategoryItems = response.data;
                            levelTwoCategoryItems_temp = $scope.levelTwoCategoryItems;
                            console.log("Success to get the second level category");
                        }, function errorCallback(response) {
                            console.log("Failed to get the second level category");
                        });
                }
            }, function errorCallback(response) {
                console.log("Failed to get the first level category");
            });

        //temp second level category items array for search feature
        levelTwoCategoryItems_temp = [];

        //select level one category
        $scope.changeLevelOneCategory = function(){
            //get level two category
            $http.get(apiPath + "eden/cates/list/leveltwo/" + $scope.levelOneCategorySelected.id)
                .then(function successCallback(response) {
                    $scope.levelTwoCategoryItems = response.data;
                    levelTwoCategoryItems_temp = $scope.levelTwoCategoryItems;
                    console.log("Success to get the second level category");
                }, function errorCallback(response) {
                    console.log("Failed to get the second level category");
                });
        };

        //filter level two category list by category name
        $scope.searchByCategory = function (){
            $scope.levelTwoCategoryItems = [];

            if (typeof $scope.levelTwoCategoryFilter == "undefined")
                $scope.levelTwoCategoryFilter = "";
            var patternLevelTwo = new RegExp($scope.levelTwoCategoryFilter, "i");
            for(item in levelTwoCategoryItems_temp){
                if(patternLevelTwo.test(levelTwoCategoryItems_temp[item].categoryName)) {
                    $scope.levelTwoCategoryItems.push(levelTwoCategoryItems_temp[item]);
                }
            }
        };

        //delete level two category
        $scope.deleteItem = function(selectedItem) {
            $scope.selectedLevelTwoCategoryID = selectedItem.id;
            $scope.selectedLevelTwoCategory = selectedItem;

            console.log("Selected id: " + selectedItem.id + " selected category name: " + selectedItem.categoryName);
        };
        $scope.deleteLevelTwoCategory = function(){
            $http.get(apiPath + "eden/cates/delete/" + $scope.selectedLevelTwoCategoryID)
                .then(function successCallback(response) {
                    console.log("Success to delete the second level category ID: " + $scope.selectedLevelTwoCategoryID);
                    $(deleteLevelTwoCategoryModal).modal('hide');

                    //get level two category
                    $http.get(apiPath + "eden/cates/list/leveltwo/" + $scope.levelOneCategorySelected.id)
                        .then(function successCallback(response) {
                            $scope.levelTwoCategoryItems = response.data;
                            levelTwoCategoryItems_temp = $scope.levelTwoCategoryItems;

                            console.log("Success to get the second level category");
                        }, function errorCallback(response) {
                            console.log("Failed to get the second level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to get the second level category");
                });
        };

        //update level two category
        $scope.updateItem = function(selectedItem){
            $scope.updatedLevelTwoItem = selectedItem;
            $scope.levelTwoCategoryUpdated = selectedItem.categoryName;
        };
        $scope.updateLevelTwoCategory = function(){
            console.log("Update the second level category: "+$scope.levelTwoCategoryUpdated);

            $scope.updatedLevelTwoItem.categoryName = $scope.levelTwoCategoryUpdated;
            $http.post(apiPath + "eden/cates/update", $scope.updatedLevelTwoItem)
                .then(function successCallback(response) {
                    console.log("Update level two category item successfully.");
                    $(updateSecondCategoryModal).modal('hide');

                    //get level two category
                    $http.get(apiPath + "eden/cates/list/leveltwo/" + $scope.levelOneCategorySelected.id)
                        .then(function successCallback(response) {
                            $scope.levelTwoCategoryItems = response.data;
                            levelTwoCategoryItems_temp = $scope.levelTwoCategoryItems;
                            console.log("Success to get the second level category");
                        }, function errorCallback(response) {
                            console.log("Failed to get the second level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to update level two category item ");
                });
        };
        $scope.updateFormValidate = function(){
            $scope.updateFormInvalid = false;
            if($scope.levelTwoCategoryUpdated === ""){
                $scope.updateFormInvalid = true;
            }
        };

        //create level two category
        $scope.createLevelTwoCategory = function(){
            var levelTwoCategoryItem = {};
            levelTwoCategoryItem.categoryName = $scope.levelTwoCategoryForLevelTwoCreation;
            levelTwoCategoryItem.categoryLevel = 2;
            levelTwoCategoryItem.categoryUpdateDate = new Date();
            levelTwoCategoryItem.categoryPrevious = $scope.levelOneCategoryForLevelTwoCreation.id;
            levelTwoCategoryItem.categoryDeleted = 0;

            $http.post(apiPath + "eden/cates/add", levelTwoCategoryItem)
                .then(function successCallback(response) {
                    console.log("Create level two category item successfully.");
                    $(newLevelTwoCategoryModal).modal('hide');

                    //get level two category
                    $http.get(apiPath + "eden/cates/list/leveltwo/" + $scope.levelOneCategorySelected.id)
                        .then(function successCallback(response) {
                            $scope.levelTwoCategoryItems = response.data;
                            levelTwoCategoryItems_temp = $scope.levelTwoCategoryItems;
                            console.log("Success to get the second level category");
                        }, function errorCallback(response) {
                            console.log("Failed to get the second level category");
                        });
                }, function errorCallback(response) {
                    console.log("Failed to create level two category item ");
                });
        };
        $scope.createFormValidate = function(){
            $scope.createFormInvalid = false;
            if(null === $scope.levelOneCategoryForLevelTwoCreation || $scope.levelTwoCategoryForLevelTwoCreation === ""){
                $scope.createFormInvalid = true;
            }
        };
    });
    app.controller("userAdminCtrl", function ($scope, $http){
        $scope.userItems = null;
        loading();

        //Get product list data
        console.log("Invoke user admin controller, get user admin list data");
        $http.get(apiPath + "eden/membs/lists")
            .then(function successCallback(response) {
                $scope.userItems = response.data;
                userItems_temp = response.data;
            }, function errorCallback(response) {
                console.log("Failed to get admin user list");
            });

        $scope.searchUserListByPhone = function (){
            $scope.userItems = [];
            var pattern = new RegExp($scope.searchPhoneNumber, "i");
            for(item in userItems_temp){
                if(pattern.test(userItems_temp[item].memberMobile)) {
                    $scope.userItems.push(userItems_temp[item]);
                }
            }
        };

        $scope.resetPWD = function(userItem) {
            //alert("用户（" + "手机号码:"+ userItem.phoneNumber+"）重置密码");
            $scope.selectedUserID = userItem.id;
            $scope.selectedUserItem = userItem;
            console.log("Selected user id: " + $scope.selectedUserID);
        };
        $scope.confirmResetPWD = function(){
            console.log("Confirmed to reset member name: " + $scope.selectedUserItem.memberName);
        };
    })
    app.controller("logDownloadCtrl", function ($scope, $http){
        $scope.logItems = null;
        loading();

        //Get download log list data
        console.log("Invoke log list controller, get download log list");
        $http.get(apiPath + "eden/logs/lists")
            .then(function successCallback(response) {
                $scope.logItems = response.data;
            }, function errorCallback(response) {
                console.log("Failed to get log list");
            });
    });
    app.controller("otherUrlCtrl", function () {
        console.log("Otherwise URL contoller...");
    });

    loading = function(){
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });
    };

}());

