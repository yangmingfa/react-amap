import React from 'react'
import {  Input } from 'antd'
import { Map,Marker } from 'react-amap'

class AmapTemplate extends React.Component{
    constructor(){
        super()
        this.state={
            show: false,
            text: '显示地图',
            center:{
                longitude: 118.1,
                latitude: 24.46
            },
            map: null,
            geocodes: null
        }
        const _this =this
        this.amapEvents = {
            created: (mapInstance) => {
                _this.setState({
                    map: mapInstance
                })
                const AMap = window.AMap   // 初次尝试使用AMap 发现拿不到实例 使用window才能拿到实例对象
                console.log('高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
                AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
                    const autoOptions = {
                        city: "厦门", //城市，默认厦门
                        input: "address_input" //使用联想输入的input的id
                    };
                    const autocomplete= new AMap.Autocomplete(autoOptions);
                    const placeSearch = new AMap.PlaceSearch({
                        city:'厦门',
                        map: mapInstance
                    })
                    AMap.event.addListener(autocomplete, "select", function(e){
                        //TODO 针对选中的poi实现自己的功能
                        placeSearch.search(e.poi.name)
                    });
                });
            }
        };
        this.markerEvents = {
            created: (markerInstance) => {
                console.log('高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
            }
        }
        this.markerPosition = { longitude: 118.1, latitude: 24.46 };
    }
    showMap(){  // 展示地图
        const address = this.state.geocodes ? this.state.geocodes[0].formattedAddress : '厦门市莲前街道观日路40号之一二楼'
        this.searchAddress(address)
        this.setState({
            show: !this.state.show,
            text: !this.state.show ? '隐藏地图' : '显示地图'
        })
    }
    handleOnBlurInput(e){ // 输入地址
        const _this = this
        const AMap = window.AMap
        const address = e.target.value
        AMap.plugin(['AMap.Geocoder'],function(){
            const geocoder = new AMap.Geocoder({
                city:'厦门',
                map: _this.state.map
            })
            geocoder.getLocation(address, function(status, result) {  // 拿到正向地理编码
                if (status === 'complete' && result.info === 'OK') {
                    _this.setState({
                        geocodes:result.geocodes
                    })
                }
            });
        });

        if (this.state.show) {  //  当地图是显示状态时  在此处在调用搜索事件一次
            this.searchAddress(address)
        }
    }
    searchAddress(address){ // 对地址进行搜索
        const _this = this
        const AMap = window.AMap
        AMap.plugin(['AMap.PlaceSearch'], function () {   // 将输入的地理位置进行搜索
            const placeSearch = new AMap.PlaceSearch({
                city: '厦门',
                map: _this.state.map
            })
            placeSearch.search(address)
            AMap.event.addListener(placeSearch, "complete", function (e) {
                //TODO 完成地图搜索以后,回调函数中可以实现一些自己的功能
                console.log('现在的地址 => ' + address + ' => 完成地图搜索以后,回调函数中可以实现一些自己的功能')
            });

        });
    }
    render(){
        return(
            <div className="address-box">
                <Input placeholder="请输入街道名称" id="address_input" onBlur={(e) => this.handleOnBlurInput(e)} onChange={this.props.onChange}/>
                <a onClick={() => this.showMap()}>{this.state.text}</a>
                <div id="map_container" style={{width:300,height:200,marginTop:10,display:'none'}} className={this.state.show ? 'show-map' : 'hidden-map'}>
                    <Map amapkey={'5bbb59d21cfd3c409bdf5a2904a308a3'} events={this.amapEvents} center={this.state.center}>
                        <Marker position={this.markerPosition} events={this.markerEvents} />
                    </Map>
                </div>
            </div>
        )
    }
}

export default AmapTemplate