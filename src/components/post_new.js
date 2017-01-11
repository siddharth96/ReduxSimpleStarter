import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {createPost} from '../actions/index';
import {Link} from 'react-router';

const FIELDS = {
    title: {
        type: 'input',
        label: 'Title',
    },
    categories: {
        type: 'input',
        label: 'Categories'
    },
    content: {
        type: 'textarea',
        label: 'Content'
    }
};

class PostsNew extends Component {
    static contextTypes = {
        router: PropTypes.object
    }

    onSubmit(props) {
        this.props.createPost(props)
            .then(() => {
                // blog has been created, navigate user to the index
                this.context.router.push('/');
            });
    }

    renderField(fieldConfig, fieldName) {
        const fieldHelper = this.props.fields[fieldName];

        return (
            <div className={`form-group ${fieldHelper.touched && fieldHelper.invalid ? 'has-danger': ''}`}>
                <label>{fieldConfig.label}</label>
                <fieldConfig.type type="text" className="form-control" {...fieldHelper} />
                <div className="text-help">
                    {fieldHelper.touched ? fieldHelper.error: ''}
                </div>
            </div>
        );
    }

    render() {
        const {fields: {title, categories, content}, handleSubmit} = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <h3>Create a new Post</h3>
                {_.map(FIELDS, this.renderField.bind(this))}
                <button type="submit" className="btn btn-primary">Submit</button>
                <Link to="/" className="btn btn-danger">Cancel</Link>
            </form>
        );
    }
}

function validate(values) {
    const errors = {};
    _.each(FIELDS, (value, key) => {
        if (!values[key]) {
            errors[key] = `Enter a ${key}`;
        }
    });
    return errors;
}

// connect: 1st arg is mapStateToProps, 2nd is mapDispatchToProps
// reduxForm: 1st arg is form config, 2nd arg is mapStateToProps, 3rd is mapDispatchToProps

export default reduxForm({
    form: 'PostsNewForm',
    fields: _.keys(FIELDS),
    validate: validate
}, null, {createPost})(PostsNew);