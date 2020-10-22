import React from 'react';
import { useTranslation } from 'react-i18next';

export default function ( props ) {
    const { t } = useTranslation();
    let { data } = props;
    let content = (
        <table className="table table-striped table-bordered text-center">
            <thead>
                <tr className="d-flex">
                    <th className="col-1">#</th>
                    <th className="col-8">{ t( 'category' ) }</th>
                    <th className="col-3">{ t( 'no_correct_answer' ) }</th>
                </tr>
            </thead>
            <tbody>
                { data.categories.map( ( category, index ) =>
                    <tr className="d-flex" key={ index }>
                        <td className="col-1">{ index + 1 }</td>
                        <td className="col-8">{ t( category.label ) + ' ( ' + category.count.toString() + t( 'unit' ) + ' )' }</td>
                        <td className="col-3">{ category.mark }</td>
                    </tr>
                ) }
                <tr className="d-flex">
                    <td className="col-9">{ t( data.total.label ) + ' ( ' + data.total.count.toString() + t( 'unit' ) + ' )' }</td>
                    <td className="col-3">{ data.total.mark }</td>
                </tr>
            </tbody>
        </table>
    );
    return <div className="row justify-content-center">
        <div className="col-sm-9">
            { content }
        </div>
    </div>;
}